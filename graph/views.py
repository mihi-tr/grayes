from djangorestframework.views import View
from djangorestframework.renderers import BaseRenderer, DocumentingHTMLRenderer, JSONRenderer, XMLRenderer
from models import Network, Relation, Entity
import networkx

class OurRenderer(XMLRenderer):
    media_type = 'xml/gexf'
    def render(self, obj=None, media_type=None):
        return obj

def sanitize(d):
    return dict([(k,v,) for k,v in d.iteritems() if not k.startswith('_')])

class NetworkGexfView(View):
    renderers = (DocumentingHTMLRenderer,OurRenderer,)
    def get(self, request, slug):
        n = Network.objects.get(slug=slug)
        graph = networkx.DiGraph()
        entities = set()

        for relation in n.relation_set.all():
            graph.add_edge(relation.source.slug, relation.target.slug, **sanitize(relation.__dict__))
            entities.add(relation.source)
            entities.add(relation.target)
        for entity in entities:
            graph.add_node(entity.slug, **sanitize(entity.__dict__))
            
        self.response['Access-Control-Allow-Origin'] = '*'

        return '\n'.join(networkx.generate_gexf(graph))
