Grayes - A grap REST API written using django 
=================================================

Grayes is a graph backend writen using django and djangorestframework. It
allows to define and query different networks using a REST API. 

Install
-------

create and source a virtualenv

run::

    pip install -r requirements.txt

edit the grayes/settings.py according to your local settings

run::
    
    python manage.py syncdb
    python manage.py runserver

to start a simple server - start editing your networks.    


