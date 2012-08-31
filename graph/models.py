from django.db import models

# Create your models here.

class Entity:
    """ The entity class defines entities. Each entity has id, title, type,
    description, slug and data. Data is a json """
    title=model.CharField(max_length=500)
    type=model.CharField(max_length=100)
    slug=model.SlugField()
    data=model.TextField()

class Relation:
    """ A relation defines a relation between entities """
    source=model.ForeignKey('Entity')
    target=model.ForeighKey('Entity')
    type=modelCharField(max_length=100)
    data=model.TextField()

