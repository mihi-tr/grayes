from django.db import models

# Create your models here.

class Network(models.Model):
    """ The network model defines the basic network """
    title=model.CharField(max_length=500)
    slug=model.SlugField()
    description=model.TextField()
    data=model.TextField()

class Entity(models.Model):
    """ The entity class defines entities. Each entity has id, title, type,
    description, slug and data. Data is a json """
    title=model.CharField(max_length=500)
    type=model.CharField(max_length=100)
    slug=model.SlugField()
    description=model.TextFlield()
    data=model.TextField()
    network=model.ForeignKey('Network')

class Relation(models.Model):
    """ A relation defines a relation between entities """
    source=model.ForeignKey('Entity')
    target=model.ForeighKey('Entity')
    type=modelCharField(max_length=100)
    data=model.TextField()
    network=model.ForeignKey('Network')

