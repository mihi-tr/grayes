from django.conf.urls.defaults import patterns, url
from djangorestframework.resources import ModelResource
from djangorestframework.views import ListOrCreateModelView, InstanceModelView
from djangorestframework.reverse import reverse
from djangorestframework.permissions import IsUserOrIsAnonReadOnly
from djangorestframework.renderers import JSONRenderer, DocumentingHTMLRenderer
from models import Entity, Relation, Network
from views import NetworkGexfView,APIOverView
from forms import RelationForm


class OurRenderer(JSONRenderer):
    media_type="application/json"
    def render(self, obj=None, media_type=None):
        self.view.response.headers['Access-Control-Allow-Origin'] = '*'
        return super(OurRenderer,self).render(obj,media_type)


class AnonReadonlyModelView(ListOrCreateModelView):
    permissions=(IsUserOrIsAnonReadOnly,)
    renderers =(DocumentingHTMLRenderer, OurRenderer, )


class AnonReadonlyInstanceView(InstanceModelView):
    permissions=(IsUserOrIsAnonReadOnly,)
    renderers =(DocumentingHTMLRenderer, OurRenderer, )


class EntityResource(ModelResource):
    model=Entity
    include=['url','relations']

    def url(self,instance):
        if hasattr(instance,'slug'):
            return reverse('entity',kwargs={'slug': instance.slug},
                request=self.request)

    def relations(self,instance):
        if hasattr(instance,'relation_source_set'):
            return [reverse('relation', kwargs={'slug': x.slug},
                request=self.request) for x in
                instance.relation_source_set.all()]+ [reverse('relation', kwargs={'slug': x.slug},
                request=self.request) for x in
                instance.relation_target_set.all()]


class RelationResource(ModelResource):
    model=Relation
    form=RelationForm

    include = ['source_url', 'target_url', 'network_url']
    exclude = ['source', 'target', 'network']

    def source_url(self, instance):
        if not isinstance(instance, Relation):
            return
        return reverse('entity', kwargs={'slug': instance.source.slug},
            request=self.request)

    def target_url(self, instance):
        if not isinstance(instance, Relation):
            return
        return reverse('entity', kwargs={'slug': instance.target.slug},
            request=self.request)

    def network_url(self, instance):
        if not isinstance(instance, Relation):
            return
        return reverse('network', kwargs={'slug': instance.network.slug},
            request=self.request)


class NetworkResource(ModelResource):
    model=Network

    include=['relations', 'gexf']

    def relations(self,instance):
        if hasattr(instance,'relation_set'):
            return [reverse('relation', kwargs={'slug': x.slug},
                request=self.request) for x in instance.relation_set.all()]

    def gexf(self, instance):
        if hasattr(instance,'slug'):
            return reverse('network-gexf', kwargs={'slug': instance.slug},
                request=self.request)



urlpatterns = patterns('',
    url(r'^networks/$',AnonReadonlyModelView.as_view(resource=NetworkResource), name='networks'),
    url(r'^networks/(?P<slug>[^/]+)/$',AnonReadonlyInstanceView.as_view(resource=NetworkResource),
        name='network'),
    url(r'^networks/(?P<slug>[^/]+)/gexf/$',NetworkGexfView.as_view(),
        name='network-gexf'),
    url(r'^entities/$', AnonReadonlyModelView.as_view(resource=EntityResource), name='entities'),
    url(r'^entities/(?P<slug>[^/]+)/$',
    AnonReadonlyInstanceView.as_view(resource=EntityResource), name='entity'),
    url(r'^relations/$',AnonReadonlyModelView.as_view(resource=RelationResource), name='relations'),
    url(r'^relations/(?P<slug>[^/]+)/$',AnonReadonlyInstanceView.as_view(resource=RelationResource),
        name='relation'),
    url(r'^$', APIOverView.as_view(), name='api',)
)

