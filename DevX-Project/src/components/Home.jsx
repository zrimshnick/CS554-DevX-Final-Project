import React from "react";
import "../App.css";
import { Route, Link, Routes } from "react-router-dom";

function Home(props) {
  let name = "Zack";
  return <div className="Home">Welcome back {name}!</div>;
}

export default Home;
