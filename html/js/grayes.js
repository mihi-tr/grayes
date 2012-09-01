function init() {
// Instanciate sigma.js and customize rendering :
var sigInst =
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
 sigInst.parseGexf('http://localhost:8000/networks/test/gexf/?format=xml');
  
// Draw the graph :
sigInst.draw();
}
   
if (document.addEventListener) {
 document.addEventListener("DOMContentLoaded", init, false);
} else {
   window.onload = init;
   }
