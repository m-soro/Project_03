import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CreateData from "./pages/CreateData";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Edit from "./pages/Edit";
import { useGetUserName } from "./hooks/useGetUserName";

function App() {
  const userName = useGetUserName();
  return (
    <div className="App">
      <Router>
        <NavBar userName={userName} />
        <Routes>
          <Route path="/" element={<Home userName={userName} />} />
          <Route
            path="/create-data"
            element={<CreateData userName={userName} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard userName={userName} />}
          />
          <Route path="/update/:id" element={<Edit />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
