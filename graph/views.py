from djangorestframework.views import View
from djangorestframework.renderers import BaseRenderer, DocumentingHTMLRenderer, JSONRenderer, XMLRenderer
from models import Network, Relation, Entity
import networkx
from networkx.readwrite.gexf import relabel_gexf_graph
from djangorestframework.reverse import reverse

from gexfsupport import render_gexf

class OurRenderer(XMLRenderer):
    media_type = 'xml/gexf'
    def render(self, obj=None, media_type=None):
        self.view.response.headers['Access-Control-Allow-Origin'] = '*'
        return obj

def sanitize(d, pk):
    x = dict([(k,v,) for k,v in d.iteritems() if not k.startswith('_') and not k=='data'])
    x['label'] = x['title'] if 'title' in x else x['slug']
    x['id'] = pk
    return x

class NetworkGexfView(View):
    renderers = (DocumentingHTMLRenderer,OurRenderer,)
    def get(self, request, slug):
        n = Network.objects.get(slug=slug)
        graph = networkx.DiGraph()
        entities = set()

        for relation in n.relation_set.all():
            graph.add_edge(relation.source.pk, relation.target.pk, **sanitize(relation.__dict__, relation.pk))
            entities.add(relation.source)
            entities.add(relation.target)
        for entity in entities:
            graph.add_node(entity.pk, **sanitize(entity.__dict__, entity.pk))

        graph2 = relabel_gexf_graph(graph)

        return '\n'.join(render_gexf(graph2))

class APIOverView(View):
    def get(self, request):
        return [{'name': 'networks',
                 'url': reverse('networks',request=request),
                },
                {'name': 'relations',
                 'url': reverse('relations', request=request),
                },
                {'name': 'entities',
                 'url': reverse('entities', request=request),
                }]
    def get_name(self):
        return self.__class__.__name__
