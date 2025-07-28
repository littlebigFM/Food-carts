import { useState } from "react";
import "./App.css";
import Foods from "./foodsProject/Foods";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Foods />
    </>
  );
}

export default App;
