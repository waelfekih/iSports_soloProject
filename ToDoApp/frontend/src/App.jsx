import {Routes, Route} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Create from "./components/Create";
import Progress from "./components/Progress";
import Completed from "./components/Completed";
import Tostart from "./components/Tostart";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<Create />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/tostart" element={<Tostart />} />

      </Routes>
  );
}

export default App;

