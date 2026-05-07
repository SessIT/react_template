import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Dashboardbak from "./pages/Dashboardbak";

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/homebak" element={<Dashboardbak />} />
    </Routes>
  );
}

export default App;
