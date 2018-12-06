import React, { Component } from "react";
import * as d3 from "d3";
import "d3-selection-multi";
import "./App.css";

class App extends Component {
  state = {
    data: null
  };
  async componentDidMount() {
    const movies = await fetch(
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json"
    ).then(res => res.json());
    this.drawMap(movies);
  }

  drawMap = data => {
    const height = 600;
    const width = 1200;

    const root = d3.hierarchy(data);
    root.sum(d => d.value);

    const treemap = d3
      .treemap()
      .size([width, height])
      .tile(d3.treemapResquarify);

    treemap(root);

    const color = d3.scaleOrdinal(d3.schemeDark2);
    const format = d3.format(",d");
    d3.select("#tree-map")
      .append("svg")
      .attrs({
        height,
        width
      })
      .append("g");

    const nodes = d3
      .select("svg g")
      .selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attrs({
        transform: d => `translate(${[d.x0, d.y0]})`
      });

    nodes.append("rect").attrs({
      class: "rect",
      width: d => d.x1 - d.x0,
      height: d => d.y1 - d.y0,
      fill: d => color(d.data.category)
    });

    nodes
      .append("text")
      .attrs({
        class: "label"
      })
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attrs({
        x: 5,
        y: (d, i) => 10 + i * 12
      })
      .text(d => d);
  };

  render() {
    return <div id="tree-map" />;
  }
}

export default App;
