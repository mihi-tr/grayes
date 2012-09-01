import networkx
from networkx.readwrite.gexf import GEXFWriter
from networkx.utils import make_str

try:
    from xml.etree.cElementTree import Element, ElementTree, tostring
except ImportError:
    try:
        from xml.etree.ElementTree import Element, ElementTree, tostring
    except ImportError:
        pass

class MyGEXFWriter(GEXFWriter):
    def add_edges(self, G, graph_element):
        def edge_key_data(G):
            # helper function to unify multigraph and graph edge iterator
            if G.is_multigraph():
                for u,v,key,data in G.edges_iter(data=True,keys=True):
                    edge_data=data.copy()
                    edge_data.update(key=key)
                    edge_id=edge_data.pop('id',None)
                    if edge_id is None:
                        edge_id=next(self.edge_id)
                    yield u,v,edge_id,edge_data
            else:
                for u,v,data in G.edges_iter(data=True):
                    edge_data=data.copy()
                    edge_id=edge_data.pop('id',None)
                    if edge_id is None:
                        edge_id=next(self.edge_id)
                    yield u,v,edge_id,edge_data

        edges_element = Element('edges')
        for u,v,key,edge_data in edge_key_data(G):
            kw={'id':make_str(key)}
            try:
                edge_weight=edge_data.pop('weight')
                kw['weight']=make_str(edge_weight)
            except KeyError:
                pass
            try:
                edge_type=edge_data.pop('type')
                kw['type']=make_str(edge_type)
            except KeyError:
                pass
            edge_element = Element("edge",
                                   source=make_str(G.node[u]['id']),target=make_str(G.node[v]['id']),
                                   **kw)
            default=G.graph.get('edge_default',{})
            edge_data=self.add_viz(edge_element,edge_data)
            edge_data=self.add_attributes("edge", edge_element,
                                          edge_data, default)
            edges_element.append(edge_element)
        graph_element.append(edges_element)

def render_gexf(G, encoding='utf-8',prettyprint=True,version='1.1draft'):
    writer = MyGEXFWriter(encoding=encoding,prettyprint=prettyprint,
                        version=version)
    writer.add_graph(G)
    for line in str(writer).splitlines():
        yield line
