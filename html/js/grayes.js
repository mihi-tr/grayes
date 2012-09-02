var apiurl="http://localhost:8000";
var sigInst;
var colorspace = {};
var edgecolorspace = {};
var zoomlevel=1;
var network='grasser-network';
var converter= new Markdown.Converter;

function zoomin() {
    zoomlevel++;
    var x=$("#network").width()/2;
    var y=$("#network").height()/2;
    sigInst.zoomTo(x,y,zoomlevel);
    }

function zoomout() {
    if (zoomlevel>1) {
        zoomlevel--;
        }
    var x=$("#network").width()/2;
    var y=$("#network").height()/2;
    sigInst.zoomTo(x,y,zoomlevel);
    }

function render_references(references) {
    return (references.map(function(reference) {
            return([
                "<li class='reference'>",
                    "<span class='date'>",
                        reference.date,
                    "</span> <a href='",
                        reference.link,
                    "' target='_new'>",
                        reference.title,
                        "</a> <span class='medium'>",
                        reference.medium,
                        "</span>",
                "</li>"
                ].join(""))
        }).join(""))
    }

function load_entity_infobox(url){
    $.getJSON(url,function(data) {
        $("#infobox-title").html(data.title);
        $("#infobox-type").html(data.type);
        $("#infobox-type").css("background",colorspace[data.type]);
        $("#infobox-description").html(converter.makeHtml(data.description));
        $("#infobox").show();
        if (data.data && data.data.references) {
            $("#infobox-references-title").show();
            $("#infobox-references").html(render_references(data.data.references));
            }
        else {
            $("#infobox-references").html("");
            $("#infobox-references-title").hide();
            }
        sigInst.iterNodes(function(n) {
            if (data.slug == n.attr.attributes.slug) {
                n.active=true;
                }
            else {
                n.active=false;
                };
            })
        sigInst.draw();    
        $("#infobox-relations").html("");
        $.each(data.relations,function(i) {
            $.getJSON(data.relations[i], function(data) {
                if (data.network_url.search(network)<0) {
                    return };
                html=[];
                html.push("<li id='"+data.slug+"'>",
                "<span class='source'></span>"," <span class='relation-title'>"+
                data.title+"</span> <span class='target'></span>",
                " <a class='expander' href='javascript:expand_description(\"",
                data.slug,"\")'>v</a>",
                "<div class='moreinfo'><div class='description'>",
                converter.makeHtml(data.description),"</div>",
                "<h2 class='references-title'>Referenzen</h2>",
                "<ul class='references'>",
                "</ul>",
                "</div>",
                "</li>")
                $("#infobox-relations").append(html.join(""));
                var li=$("#"+data.slug);
                if (data.data && data.data.references) {
                    li.find(".references-title").show();
                    li.find(".references").html(render_references(data.data.references));
                    }
                else {
                    li.find(".references").html("");
                    li.find(".references-title").hide();
                    }
                $.getJSON(data.source_url,function(data) {
                    li.find(".source").html([
                        "<a href='javascript:load_entity_infobox(\"",
                        data.url,"\")'>",data.title,"</a>"
                    ].join(""))
                    })
                $.getJSON(data.target_url,function(data) {
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
    $('#network').css("height",$(window).height()-100+"px")
// Instanciate sigma.js and customize rendering :
sigInst =
sigma.init(document.getElementById('network')).drawingProperties({
defaultLabelColor: '#fff',
defaultLabelSize: 14,
defaultLabelBGColor: '#ffffff',
defaultLabelHoverColor: '#000',
labelThreshold: 6,
defaultEdgeType: 'line'
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
 sigInst.parseGexf(apiurl+'/networks/'+network+'/gexf/?format=xml');

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
sigInst.startForceAtlas2();
setTimeout(function() {sigInst.stopForceAtlas2()},5000);

}

if (document.addEventListener) {
document.addEventListener('DOMContentLoaded', init, false);
} else {
window.onload = init;
}
