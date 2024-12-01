import { Route, Routes, Navigate } from "react-router-dom";
import RouteTransition from "../utils/RouteTransition";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound/NotFound";
import Hikvision from "../pages/Hikvision/Events";
import Samsung from "../pages/Samsung/Events";
import ProtectedRoute from "./ProtectedRoute";
import Email from "../pages/Email/Email";
import Login from "../pages/Login/Login";


const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={ <RouteTransition><Login /></RouteTransition>} />
    <Route element={<ProtectedRoute />}> <Route path="/" element={ <RouteTransition> <Dashboard /></RouteTransition>} />
      <Route path="/dashboard" element={ <RouteTransition> <Dashboard /> </RouteTransition>} />
      <Route path="/hikvision" element={ <RouteTransition> <Hikvision /> </RouteTransition>} />
      <Route path="/samsung" element={ <RouteTransition> <Samsung /> </RouteTransition>} />
      <Route path="/email" element={ <RouteTransition> <Email /> </RouteTransition>} />
      <Route path="*" element={ <RouteTransition> <NotFound /> </RouteTransition>} />
    </Route>
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;
