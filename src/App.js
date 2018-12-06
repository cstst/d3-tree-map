import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    data: null
  };
  async componentDidMount() {
    const movies = await fetch(
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json"
    ).then(res => res.json());
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
    console.log(genreTotals);
  }

  render() {
    return (
      <div>
        <div id="tree-map" />
      </div>
    );
  }
}

export default App;
