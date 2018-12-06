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
    /*
    const genres = movies.children;
    console.log(genres);
    const genreTotals = genres.map(genre => {
      const name = genre.name;
      const total = genre.children.reduce(
        (acc, val) => acc + parseInt(val.value),
        0
      );
      return { name, total };
    });
    */
    this.drawMap(movies);
  }

  drawMap = data => {
    const height = 1000;
    const width = 1000;

    const root = d3.hierarchy(data);
    root.sum(d => d.value);

    const treemap = d3
      .treemap()
      .size([height, width])
      .paddingOuter(10)
      .paddingInner(1);

    treemap(root);

    const svg = d3
      .select("#tree-map")
      .append("svg")
      .attrs({
        height,
        width
      })
      .append("g");

    const nodes = d3
      .select("svg g")
      .selectAll("rect")
      .data(root.descendants())
      .enter();

    nodes.append("rect").attrs({
      class: "rect",
      name: d => d.data.name,
      x: d => d.x0,
      y: d => d.y0,
      width: d => d.x1 - d.x0,
      height: d => d.y1 - d.y0
    });
    nodes
      .append("text")
      .attrs({
        class: "label"
      })
      .selectAll("tspan")
      .data(function(d) {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g);
      })
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", function(d, i) {
        return 13 + i * 10;
      })
      .text(function(d) {
        return d;
      });
  };

  render() {
    return <div id="tree-map" />;
  }
}

export default App;
