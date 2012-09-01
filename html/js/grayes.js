var apiurl="http://localhost:8000"
var sigInst
function load_entity_info(event){
    var node;
    sigInst.iterNodes(function(n) { node=n;},[event.content[0]]);
    var slug= node.attr.attributes[0].val; // FSCK Gexf parser
    var url= apiurl+"/entities/"+slug+"/?format=json"
    $.getJSON(url,function(data) {
        var html=[]
        console.log(data);
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
defaultLabelBGColor: '#fff',
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

 sigInst.bind('overnodes',load_entity_info);
  
// Draw the graph :
sigInst.draw();
}

if (document.addEventListener) {
document.addEventListener('DOMContentLoaded', init, false);
} else {
window.onload = init;
}
