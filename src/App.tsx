import React from "react";
import Calendar from "./components/Calendar";
import Recorder from "./components/Recorder";

const App: React.FC = () => {
  return (
    <div className="App">
      <Recorder />
      <Calendar />
    </div>
  );
};

export default App;
