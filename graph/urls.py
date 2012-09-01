from django.conf.urls.defaults import patterns, url
from djangorestframework.resources import ModelResource
from djangorestframework.views import ListOrCreateModelView, InstanceModelView
from djangorestframework.reverse import reverse
from djangorestframework.permissions import IsUserOrIsAnonReadOnly
from models import Entity, Relation, Network
from views import NetworkGexfView

class AnonReadonlyModelView(ListOrCreateModelView):
    permissions=(IsUserOrIsAnonReadOnly,)

class AnonReadonlyInstanceView(InstanceModelView):
    permissions=(IsUserOrIsAnonReadOnly,)

class EntityResource(ModelResource):
    model=Entity
    include=['url']

    def url(self,instance):
        if hasattr(instance,'slug'):
            return reverse('entity',kwargs={'slug': instance.slug},
                request=self.request)


class RelationResource(ModelResource):
    model=Relation

    def source(self, instance):
        return reverse('entity', kwargs={'slug': instance.source.slug},
            request=self.request)

    def target(self, instance):
        return reverse('entity', kwargs={'slug': instance.target.slug},
            request=self.request)

    def network(self, instance):
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
    url(r'^networks/$',AnonReadonlyModelView.as_view(resource=NetworkResource)),
    url(r'^networks/(?P<slug>[^/]+)/$',AnonReadonlyInstanceView.as_view(resource=NetworkResource),
        name='network'),
    url(r'^networks/(?P<slug>[^/]+)/gexf/$',NetworkGexfView.as_view(),
        name='network-gexf'),
    url(r'^entities/$', AnonReadonlyModelView.as_view(resource=EntityResource)),
    url(r'^entities/(?P<slug>[^/]+)/$',
    AnonReadonlyInstanceView.as_view(resource=EntityResource), name='entity'),
    url(r'^relations/$',AnonReadonlyModelView.as_view(resource=RelationResource)),
    url(r'^relations/(?P<slug>[^/]+)/$',AnonReadonlyInstanceView.as_view(resource=RelationResource),
        name='relation'),
        )

