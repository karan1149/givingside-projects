sigma.utils.pkg('sigma.canvas.nodes');
sigma.canvas.nodes.image = (function() {
  var _cache = {},
      _loading = {},
      _callbacks = {};

  // Return the renderer itself:
  var renderer = function(node, context, settings) {
    var args = arguments,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        color = node.color || settings('defaultNodeColor'),
        url = node.url;

    if (_cache[url]) {
      context.save();

      // Draw the clipping disc:
      context.beginPath();
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.clip();

      // Draw the image
      context.drawImage(
        _cache[url],
        node[prefix + 'x'] - size,
        node[prefix + 'y'] - size,
        2 * size,
        2 * size
      );

      // Quit the "clipping mode":
      context.restore();

      // Draw the border:
      context.beginPath();
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );
      context.lineWidth = size / 50;
      context.strokeStyle = node.color || settings('defaultNodeColor');
      context.stroke();
    } else {
      sigma.canvas.nodes.image.cache(url);
      sigma.canvas.nodes.def.apply(
        sigma.canvas.nodes,
        args
      );
    }
  };

  // Let's add a public method to cache images, to make it possible to
  // preload images before the initial rendering:
  renderer.cache = function(url, callback) {
    if (callback)
      _callbacks[url] = callback;

    if (_loading[url])
      return;

    var img = new Image();

    img.onload = function() {
      _loading[url] = false;
      _cache[url] = img;

      if (_callbacks[url]) {
        _callbacks[url].call(this, img);
        delete _callbacks[url];
      }
    };

    _loading[url] = true;
    img.src = url;
  };

  return renderer;
})();

/*
 * End image renderer
 */






 var g = {
       nodes: [],
       edges: []
     },
     loaded = 0;

var nodesInfo = [
  {
    "label": "You",
    "url": 'images/thea_photo.jpg'
  },
  {
    "label": "American Red Cross",
    "url": 'images/american-redcross.jpeg',
    "desc": "American Red Cross description that is enticing and very interesting. It tells you many things.",
    "siteUrl": "http://redcross.org"
  },
  {
    "label": "Nature Conservancy",
    "url": "images/nature-conservancy.gif",
    "desc": "Nature description"
  },
  {
    "label": "Doctors without Borders",
    "url": "images/doctors-without-borders.png",
    "desc": "Doctors description here that is long and meaningful"
  },
  {
    "label": "Wounded Warrior Project",
    "url": "images/wounded-warrior.jpeg",
    "desc": "Wounder Warrior description that tells you a lot about the nonprofit"
  }
];

// generate urls array so that we can later cache them
var urls = [];
nodesInfo.forEach(function(node){
  if (node.url) urls.push(node.url);
});



  // push "You" node
  g.nodes.push({
    id: 'n0',
    type: nodesInfo[0].url ? 'image' : 'def',
    url: nodesInfo[0].url,
    x: 0,
    y: 0,
    size: 1
  });

 // push nonprofit nodes to graph
 for (i = 1; i < nodesInfo.length; i++) {
   var rads = ((i - 1) / (nodesInfo.length - 1)) * 2 * Math.PI;
   var newX = 6.5 * Math.cos(rads + .4 * Math.random() - .2) + Math.random() * .6 - .3;
   var newY = 4 * Math.sin(rads + .4 * Math.random() - .2) + Math.random() * .6 - .3;
  //  var newX = Math.random() > .5 ? Math.random() + .75 : Math.random() - 1.75;
  //  var newY = Math.random() > .5 ? Math.random() + .75 : Math.random() - 1.75;
   g.nodes.push({
     id: 'n' + i,
     label: nodesInfo[i].label.length >= 25 ? nodesInfo[i].label.substring(0, 22) + "...": nodesInfo[i].label,
     type: nodesInfo[i].url ? 'image' : 'def',
     url: nodesInfo[i].url,
     x: newX,
     y: newY,
     size: Math.random() * .5 + .25,
     desc: nodesInfo[i].desc
   });
 }

 // push all edges
 for (i = 1; i < g.nodes.length; i++)
   g.edges.push({
     id: 'e' + i,
     source: 'n0',
     target: 'n' + i,
     size: Math.random()
   });


var s;
 // Then, wait for all images to be loaded before instanciating sigma:
 urls.forEach(function(url) {
   sigma.canvas.nodes.image.cache(
     url,
     function() {
       if (++loaded === urls.length){
         // Instantiate sigma:
         s = new sigma({
             graph: g,
             renderer: {
               // IMPORTANT:
               // This works only with the canvas renderer, so the
               // renderer type set as "canvas" is necessary here.
               container: 'container',
               type: 'canvas'
             },
             settings: {
                 defaultNodeColor: '#2fe9f8'
             },

           });
               s.bind('clickNode', function(e) {
                 if (e.data.node.id != "n0")
                   swal({
                     title: e.data.node.label,
                     text: e.data.node.desc ? e.data.node.desc : ""
                   });
                 // s.refresh();
               });

       }


     }
   );
 });

 /* Render cards */
for (var i = 1; i < nodesInfo.length; i++){
  appendCard(nodesInfo[i].label, nodesInfo[i].desc, nodesInfo[i].url, nodesInfo[i].siteUrl);
}



 function appendCard(title, description, imageUrl, siteUrl){
   var cardContainer = $("#cards-container");
   /*
   <div class="card small">
      <div class="card-image">
        <img src="images/thea_photo.jpg">
        <span class="card-title">Nonprofit title</span>
      </div>
      <div class="card-content">
        <p>I am a very simple card. I am good at containing small bits of information.
        I am convenient because I require little markup to use effectively.</p>
      </div>
      <div class="card-action">
        <a href="#">Visit site</a>
      </div>
    </div>
    */

   var cardMarkup = '<div class="card small"><div class="card-image"><div><div class="card-image-overlay"></div><img src="';
   cardMarkup += imageUrl;
   cardMarkup += '"></div><span class="card-title">';
   cardMarkup += title;
   cardMarkup += '</span> </div><div class="card-content"><p>';
   cardMarkup += description;
   cardMarkup += '</p></div><div class="card-action"> <a href="';
   cardMarkup += siteUrl;
   cardMarkup += '">Visit site</a></div></div>';
   cardContainer.append(cardMarkup);
 }


 /* View graph and view cards functions */
 function toggleView(){
   var toggleButton = $("#toggle");
   if (toggleButton.hasClass("graph-view")){
     var cardsContainer = $("#cards-container");
     cardsContainer.css("display", "block");
     $("#container").css("display", "none");
     toggleButton.text("Switch to Graph View");

   } else {
     var cardsContainer = $("#cards-container");
     cardsContainer.css("display", "none");
     $("#container").css("display", "block");
     toggleButton.text("Switch to Card View");
   }
   toggleButton.toggleClass("graph-view");
 }
 // // function viewGraph(){
 //   var cardsContainer = $("#cards-container");
 //   console.log(cardsContainer);
 //   cardsContainer.css("display", "none");
 //   $("#container").css("display", "block");
 // // }
 // //
 // // function viewCards(){
 //   var cardsContainer = $("#cards-container");
 //   cardsContainer.css("display", "block");
 //   $("#container").css("display", "none");
 // // }
