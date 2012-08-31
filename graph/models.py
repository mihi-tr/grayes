from django.db import models
from json_field import JSONField

# Create your models here.

class Network(models.Model):
    """ The network model defines the basic network """
    title=models.CharField(max_length=500)
    slug=models.SlugField()
    description=models.TextField(null=True,blank=True)
    data=JSONField(null=True,blank=True)

    def __unicode__(self):
        return self.title

class Entity(models.Model):
    """ The entity class defines entities. Each entity has id, title, type,
    description, slug and data. Data is a json """
    title=models.CharField(max_length=500)
    type=models.CharField(max_length=100)
    slug=models.SlugField()
    description=models.TextField(null=True,blank=True)
    data=JSONField(null=True,blank=True)

    def __unicode__(self):
        return self.title

class Relation(models.Model):
    """ A relation defines a relation between entities """
    source=models.ForeignKey('Entity',related_name='relation_source_set')
    target=models.ForeignKey('Entity',related_name='relation_target_set')
    type=models.CharField(max_length=100)
    slug=models.SlugField()
    description=models.TextField(null=True, blank=True)
    data=JSONField(null=True,blank=True)
    network=models.ForeignKey('Network')

    def __unicode__(self):
        return "%s->%s"%(self.source.title,self.target.title)

