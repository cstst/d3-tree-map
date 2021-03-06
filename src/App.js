import React, { Component } from "react";
import * as d3 from "d3";
import moneyCommas from "./moneyCommas";
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
    const height = 575;
    const width = 1200;

    const root = d3.hierarchy(data);
    root.sum(d => d.value);

    const treemap = d3
      .treemap()
      .size([width, height])
      .tile(d3.treemapResquarify);

    treemap(root);

    const color = d3.scaleOrdinal(d3.schemeDark2);

    const tooltip = d3
      .select("#treemap")
      .append("div")
      .attrs({
        id: "tooltip"
      });

    d3.select("#treemap")
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

    nodes
      .append("rect")
      .attrs({
        class: "tile",
        width: d => d.x1 - d.x0,
        height: d => d.y1 - d.y0,
        fill: d => color(d.data.category),
        "data-name": d => d.data.name,
        "data-category": d => d.data.category,
        "data-value": d => d.data.value
      })
      .on("mouseover", d => {
        const { name, category, value } = d.data;
        tooltip
          .text(`${name}\n${category}\n$${moneyCommas(value)}`)
          .attrs({
            "data-vale": value
          })
          .styles({
            visibility: "visible"
          });
      })
      .on("mousemove", () => {
        tooltip
          .style("top", d3.event.pageY - 100 + "px")
          .style("left", d3.event.pageX - 40 + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
      });

    nodes
      .append("text")
      .attrs({
        class: "label"
      })
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z.])/g))
      .enter()
      .append("tspan")
      .attrs({
        x: 3,
        y: (d, i) => 10 + i * 10
      })
      .text(d => d);
  };

  render() {
    return (
      <div id="container">
        <h1 id="title">Movie Sales</h1>
        <div id="description">
          Top 100 Highest Grossing Movies Grouped By Genre
        </div>
        <div id="treemap" />
      </div>
    );
  }
}

export default App;
