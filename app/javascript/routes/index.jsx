import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout"

export default (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />} />
    </Routes>
  </Router>
);