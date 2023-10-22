import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CreateData from "./pages/CreateData";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Edit from "./pages/Edit";
import resortsHelperDataContext from "./contexts/resortsHelperDataContext";

function App() {
  const [helperFile, setHelperFile] = useState(null);
  useEffect(() => {
    const fetchHelperFile = async () => {
      try {
        const response = await axios.get(
          "https://open-peaks-v2-backend.onrender.com/dataseed/get-helper-file"
        );
        setHelperFile(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHelperFile();
  }, []);

  return (
    <div className="App">
      <resortsHelperDataContext.Provider value={helperFile}>
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
      </resortsHelperDataContext.Provider>
    </div>
  );
}

export default App;
