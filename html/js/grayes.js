var apiurl="http://localhost:8000"
var sigInst
var colorspace = {
    "person":"#FF0000",
    "company":"#666"
    }

function load_entity_info(event){
    var node;
    sigInst.iterNodes(function(n) { node=n;},[event.content[0]]);
    var slug= node.attr.attributes[0].val; // FSCK Gexf parser
    var url= apiurl+"/entities/"+slug+"/?format=json"
    $.getJSON(url,function(data) {
        var html=[]
        for (i in data) {
            html.push("<div class='attribute'><span class='key'>",i,
            "</span>:<span class='value'>",data[i],"</span></div>")
            }
        $("#infobox").html(html.join(""))    
        })
    }

function init() {
// Instanciate sigma.js and customize rendering :
sigInst =
sigma.init(document.getElementById('network')).drawingProperties({
defaultLabelColor: '#fff',
defaultLabelSize: 14,
defaultLabelBGColor: '#ffffff',
defaultLabelHoverColor: '#000',
labelThreshold: 6,
defaultEdgeType: 'curve'
}).graphProperties({
minNodeSize: 0.5,
maxNodeSize: 5,
minEdgeSize: 1,
maxEdgeSize: 1
}).mouseProperties({
maxRatio: 32
});
 
 // Parse a GEXF encoded file to fill the graph
 // (requires "sigma.parseGexf.js" to be included)
 sigInst.parseGexf(apiurl+'/networks/test/gexf/?format=xml');

 var nodetypes=[]
 var edgetypes=[]
 sigInst.bind('downnodes',load_entity_info);
 sigInst.iterNodes(function(n) {
    n.color=colorspace[n.attr.attributes[3].val];
    })
  
// Draw the graph :
sigInst.draw();
}

if (document.addEventListener) {
document.addEventListener('DOMContentLoaded', init, false);
} else {
window.onload = init;
}
