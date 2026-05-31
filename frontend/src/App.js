import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { useState } from "react";

// ✅ REACT QUERY
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import DashboardHome from "./pages/DashboardHome";
import ClientesPage from "./pages/ClientesPage";
import IngresosPage from "./pages/IngresosPage";
import CitasPage from "./pages/CitasPage"; // ✅ NUEVO
import ReportesPage from "./pages/ReportesPage";
import SettingsPage from "./pages/SettingsPage";

import Login from "./pages/Login";
import Layout from "./components/Layout";

// ✅ CLIENT GLOBAL
const queryClient = new QueryClient();

function App() {

  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ LOGIN
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <QueryClientProvider client={queryClient}>

      {/* ✅ TOAST GLOBAL */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "12px",
            padding: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }
        }}
      />

      {/* ✅ ROUTER */}
      <Router>
        <Layout setToken={setToken}>
          <Routes>

            {/* ✅ DASHBOARD */}
            <Route path="/" element={<DashboardHome />} />

            {/* ✅ CLIENTES */}
            <Route path="/clientes" element={<ClientesPage />} />

            {/* ✅ FACTURACIÓN */}
            <Route path="/facturaciones" element={<IngresosPage />} />

            {/* ✅ CITAS 🔥 */}
            <Route path="/citas" element={<CitasPage />} />

            {/* ✅ REPORTES */}
            <Route path="/reportes" element={<ReportesPage />} />

            {/* ✅ CONFIG */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* ✅ REDIRECT */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </Layout>
      </Router>

    </QueryClientProvider>
  );
}

export default App;