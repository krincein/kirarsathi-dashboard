import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Login from "./pages/Login";
import UserDetails from "./pages/UserDetails";
import "./styles.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // stored after login
  return token ? children : <Navigate to="/login" replace />;
}

function Layout() {
  const location = useLocation();

  // Hide sidebar on login page
  const hideSidebar = location.pathname === "/login";

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />}
      <div
        style={{
          flexGrow: 1,
          padding: hideSidebar ? "0" : "20px",
          background: "#f7f9fc",
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />

            <Route path="/users/:id" element={   <PrivateRoute><UserDetails /> </PrivateRoute>} />


        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
