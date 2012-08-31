from django.conf.urls.defaults import patterns, url
from djangorestframework.resources import ModelResource
from djangorestframework.views import ListOrCreateModelView, InstanceModelView
from models import Entity, Relation, Network

class EntityResource(ModelResource):
    model=Entity

class RelationResource(ModelResource):
    model=Relations

class NetworkResource(ModelResource):
    model=Network

urlpatterns = patterns('',
    url(r'^/Entity/$', ListOrCreateModelView.as_view(resource=EntityResource)),
    url(r'^/Entity/(?P<pk>[^/]+)/$', InstanceModelView.as_view(resource=EntityResource)),
        )
    
