import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

// ✅ AUTH GLOBAL
import { useAuthContext } from "./context/AuthContext";

// ✅ REACT QUERY
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import DashboardHome from "./pages/DashboardHome";
import ClientesPage from "./pages/ClientesPage";
import IngresosPage from "./pages/IngresosPage";
import CitasPage from "./pages/CitasPage";
import ReportesPage from "./pages/ReportesPage";
import SettingsPage from "./pages/SettingsPage";

import Login from "./pages/Login";
import Layout from "./components/Layout";

// ✅ CLIENT GLOBAL
const queryClient = new QueryClient();

function App() {

  const { token } = useAuthContext();

  return (
    <>
      {/* ✅ TOAST SIEMPRE ACTIVO */}
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

      {!token ? (
        <Login />  
      ) : (
        <QueryClientProvider client={queryClient}>
          <Router>
            <Layout>
              <Routes>

                <Route path="/" element={<DashboardHome />} />
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/facturaciones" element={<IngresosPage />} />
                <Route path="/citas" element={<CitasPage />} />
                <Route path="/reportes" element={<ReportesPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                <Route path="*" element={<Navigate to="/" />} />

              </Routes>
            </Layout>
          </Router>
        </QueryClientProvider>
      )}
    </>
  );
}

export default App;