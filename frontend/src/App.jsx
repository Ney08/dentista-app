import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Toaster
} from "react-hot-toast";

import {
  useAuthContext
} from "./context/AuthContext";

import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

import DashboardHome from "./pages/DashboardHome";
import ClientesPage from "./pages/ClientesPage";
import IngresosPage from "./pages/IngresosPage";
import CitasPage from "./pages/CitasPage";
import ReportesPage from "./pages/ReportesPage";
import SettingsPage from "./pages/SettingsPage";
import EgresosPage from "./pages/EgresosPage";
import Login from "./pages/Login";

import Layout from "./components/Layout";

const queryClient =
  new QueryClient();

function App() {

  const {
    token
  } = useAuthContext();

  return (

    <QueryClientProvider
      client={queryClient}
    >

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={16}
        containerStyle={{
          top: 24,
          right: 24,
          zIndex: 2147483647
        }}
        toastOptions={{
          style: {
            zIndex: 2147483647
          }
        }}
      />

      {!token ? (

        <Login />

      ) : (

        <Router>

          <Layout>

            <Routes>

              <Route
                path="/"
                element={<DashboardHome />}
              />

              <Route
                path="/clientes"
                element={<ClientesPage />}
              />

              <Route
                path="/facturaciones"
                element={<IngresosPage />}
              />

              <Route
                path="/citas"
                element={<CitasPage />}
              />

              <Route
                path="/reportes"
                element={<ReportesPage />}
              />

              <Route
                path="/settings"
                element={<SettingsPage />}
              />

              <Route
                path="/egresos"
                element={<EgresosPage />}
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />

            </Routes>

          </Layout>

        </Router>

      )}

    </QueryClientProvider>

  );

}

export default App;