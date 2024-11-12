function loadData(json) {
  console.log("Starting loadData function"); // Log to check if the function runs

  // Create a force simulation with nodes and links
  var simulation = d3.forceSimulation(json.nodes)
      .force("link", d3.forceLink(json.links)
                       .id(d => d.id)  // Use node id as identifier
                       .distance((width + height) / 4))
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2));

  console.log("Simulation initialized");

  // Define link elements
  var link = svg.selectAll("line.link")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  console.log("Links added");

  // Define node elements
  var node = svg.selectAll("circle.node")
      .data(json.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return getrank(d.rank); })
      .style("fill", function(d) { return getcolor(d.rank); })
      .on("dblclick", function(d) {
          if (confirm('Do you want to open ' + d.url))
              window.open(d.url, '_new', '');
          d3.event.stopPropagation();
      })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  console.log("Nodes added");

  node.append("title")
      .text(function(d) { return d.url; });

  simulation.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  console.log("Simulation tick function set");

  // Drag event functions
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
