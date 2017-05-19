sigma.parsers.json('data.json', {
  container: 'container',
  settings: {
    defaultNodeColor: '#ec5148'
  }
  },
  function(s) {
    s.bind('clickNode', function(e) {
     swal(e.data.node.label);
      // s.refresh();
    });

    /* // When the stage is clicked, we just color each
    // node and edge with its original color.
    s.bind('clickStage', function(e) {
      s.graph.nodes().forEach(function(n) {
        n.color = n.originalColor;
      });

      s.graph.edges().forEach(function(e) {
        e.color = e.originalColor;
      });

      // Same as in the previous event:
      s.refresh();
    }); */

});
