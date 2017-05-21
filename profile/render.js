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






 var s,
     g = {
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
    "url": 'images/american-redcross.jpeg'
  },
  {
    "label": "Nature Conservancy",
  },
  {
    "label": "Doctors without Borders",
  },
  {
    "label": "Wounded Warrior Project"
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
    size: 1.75
  });

 // push nonprofit nodes to graph
 for (i = 1; i < nodesInfo.length; i++) {
   g.nodes.push({
     id: 'n' + i,
     label: nodesInfo[i].label,
     type: nodesInfo[i].url ? 'image' : 'def',
     url: nodesInfo[i].url,
     x: Math.random() * 2 - 1,
     y: Math.random() * 2 - 1,
     size: Math.random() * .5 + .25
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

   console.log(g.nodes);
   console.log(g.edges);

 // Now that's the renderer has been implemented, let's generate a graph
 // to render:
 // var i,
 //     s,
 //     img,
 //     N = 100,
 //     E = 500,
 //     g = {
 //       nodes: [],
 //       edges: []
 //     },
 //     loaded = 0,
 //     colors = [
 //       '#617db4',
 //       '#668f3c',
 //       '#c6583e',
 //       '#b956af'
 //     ];
 //
 // // Generate a random graph, with ~30% nodes having the type "image":
 // for (i = 0; i < N; i++) {
 //   img = Math.random() >= 0.7;
 //   g.nodes.push({
 //     id: 'n' + i,
 //     label: 'Node ' + i,
 //     type: img ? 'image' : 'def',
 //     url: img ? urls[Math.floor(Math.random() * urls.length)] : null,
 //     x: Math.random(),
 //     y: Math.random(),
 //     size: Math.random(),
 //     color: colors[Math.floor(Math.random() * colors.length)]
 //   });
 // }
 //
 // for (i = 0; i < E; i++)
 //   g.edges.push({
 //     id: 'e' + i,
 //     source: 'n' + (Math.random() * N | 0),
 //     target: 'n' + (Math.random() * N | 0),
 //     size: Math.random()
 //   });

 // Then, wait for all images to be loaded before instanciating sigma:
 urls.forEach(function(url) {
   sigma.canvas.nodes.image.cache(
     url,
     function() {
       if (++loaded === urls.length)
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
               defaultNodeColor: '#ec5148'
           },

         });


        // sigma.parsers.json('data.json', {
        //
        //   settings: {
        //     defaultNodeColor: '#ec5148'
        //   },
        //   renderer: {
        //     container: 'container',
        //     type: 'canvas'
        //   },
        //   },
        //   function(s) {
        //     s.bind('clickNode', function(e) {
        //       if (e.data.node.label != "You")
        //         swal(e.data.node.label);
        //       // s.refresh();
        //     });
        //
        //
        // });
     }
   );
 });
