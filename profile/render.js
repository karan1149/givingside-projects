sigma.parsers.json('data.json', {

  settings: {
    defaultNodeColor: '#ec5148'
  },
  renderer: {
    container: 'container',
    type: 'canvas'
  },
  },
  function(s) {
    s.bind('clickNode', function(e) {
      if (e.data.node.label != "You")
        swal(e.data.node.label);
      // s.refresh();
    });


});
