import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import Sketch from "./components/Sketch";

import sketch1 from "./components/s1";

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sketch/:id" element={<Sketch sketch={sketch1}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
