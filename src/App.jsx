import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CreateData from "./pages/CreateData";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Edit from "./pages/Edit";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-data" element={<CreateData />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update/:id" element={<Edit />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
