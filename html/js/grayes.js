var apiurl="http://localhost:8000"
var sigInst
var colorspace = {}
var edgecolorspace = {}


function load_entity_infobox(url){
    $.getJSON(url,function(data) {
        $("#infobox-title").html(data.title);
        $("#infobox-type").html(data.type);
        $("#infobox-type").css("background",colorspace[data.type]);
        $("#infobox-description").html(data.description);
        $("#infobox").show();
        $("#infobox-relations").html("");
        sigInst.iterNodes(function(n) {
            if (data.slug == n.attr.attributes.slug) {
                n.active=true;
                }
            else {
                n.active=false;
                };
            })
        sigInst.draw();    
        $.each(data.relations,function(i) {
            $.getJSON(data.relations[i], function(data) {
                html=[];
                html.push("<li id='"+data.slug+"'>",
                "<span class='source'></span>"," <span class='relation-title'>"+
                data.title+"</span> <span class='target'></span>",
                " <a class='expander' href='javascript:expand_description(\"",
                data.slug,"\")'>v</a>",
                "<div class='description'>",data.description,"</div>",
                "</li>")
                $("#infobox-relations").append(html.join(""));
                var li=$("#"+data.slug);
                $.getJSON(data.source,function(data) {
                    li.find(".source").html([
                        "<a href='javascript:load_entity_infobox(\"",
                        data.url,"\")'>",data.title,"</a>"
                    ].join(""))
                    })
                $.getJSON(data.target,function(data) {
                    li.find(".target").html([
                        "<a href='javascript:load_entity_infobox(\""
                        ,data.url,"\")'>",data.title,"</a>"
                        ].join(""));
                    })
                })
            });
        })
    }
function expand_description(id) {
    e=$("#"+id);
    if (e.hasClass("expanded")) {
        e.removeClass("expanded");
        }
    else {
        e.addClass("expanded");
        }
    }

function load_entity_info(event){
    var node;
    sigInst.iterNodes(function(n) { node=n;},[event.content[0]]);
    var slug= node.attr.attributes["slug"]; // FSCK Gexf parser
    var url= apiurl+"/entities/"+slug+"/?format=json"
    load_entity_infobox(url);
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
 var step=255./(nodetypes.length>1?nodetypes.length-1:1);
 for (i=0.; i<nodetypes.length; i++) {

    colorspace[nodetypes[i]]="hsl("+i*step+",100%,80%)";
    }
 
    
 var edgetypes=[]
 sigInst.iterEdges(function(n) {
    var type=n.attr.attributes["type"]
    if ($.inArray(type,edgetypes)<0) {
        edgetypes.push(type)
        }
    })
 var step=255./(edgetypes.length-1);
 for (i=0.; i<edgetypes.length; i++) {

    edgecolorspace[edgetypes[i]]="hsl("+i*step+",100%,75%)";
    }

 sigInst.bind('downnodes',load_entity_info);
 sigInst.iterNodes(function(n) {
    n.color=colorspace[n.attr.attributes["type"]];
    })
 sigInst.iterEdges(function(n) {
    n.color=edgecolorspace[n.attr.attributes["type"]];
    })
  
// Draw the graph :
sigInst.draw();
}

if (document.addEventListener) {
document.addEventListener('DOMContentLoaded', init, false);
} else {
window.onload = init;
}
