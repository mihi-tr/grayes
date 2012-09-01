var apiurl="http://localhost:8000"
var sigInst
var colorspace = {}

function load_entity_info(event){
    var node;
    sigInst.iterNodes(function(n) { node=n;},[event.content[0]]);
    var slug= node.attr.attributes["slug"]; // FSCK Gexf parser
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
 sigInst.iterNodes(function(n) {
    var type=n.attr.attributes["type"]
    if ($.inArray(type,nodetypes)<0) {
        nodetypes.push(type)
        }
    })
 var step=255./(nodetypes.length-1);
 for (i=0.; i<nodetypes.length; i++) {

    colorspace[nodetypes[i]]="hsl("+i*step+",100%,75%)";
    }
 
    
 console.log(colorspace)   
 var edgetypes=[]
 sigInst.iterEdges(function(n) {
    var type=n.attr.attributes["type"]
    console.log(type)
    if ($.inArray(type,edgetypes)<0) {
        edgetypes.push(type)
        }
    })
 console.log(edgetypes)
 sigInst.bind('downnodes',load_entity_info);
 sigInst.iterNodes(function(n) {
    n.color=colorspace[n.attr.attributes["type"]];
    })
  
// Draw the graph :
sigInst.draw();
}

if (document.addEventListener) {
document.addEventListener('DOMContentLoaded', init, false);
} else {
window.onload = init;
}
