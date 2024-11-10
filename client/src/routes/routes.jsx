import { Route, Routes, Navigate } from "react-router-dom";
import RouteTransition from "../utils/RouteTransition";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound/NotFound";
import Events from "../pages/Events/Events";
import Transactions from "../pages/Transactions/Transactions";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/Login";

import EventsSuport from "../pages/EventsSuport/EventsSuport";



const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <RouteTransition>
          <Login />
        </RouteTransition>
      }
    />
    <Route element={<ProtectedRoute />}>
      <Route
        path="/"
        element={
          <RouteTransition>
            <Dashboard />
          </RouteTransition>
        }
      />
      <Route
        path="/events"
        element={
          <RouteTransition>
            <Events />
          </RouteTransition>
        }
      />

      <Route
        path="/events/suport"
        element={
          <RouteTransition>
            <EventsSuport />
          </RouteTransition>
        }
      />

      <Route
        path="/transactions"
        element={
          <RouteTransition>
            <Transactions />  
          </RouteTransition>
        }
      />



      <Route
        path="*"
        element={
          <RouteTransition>
            <NotFound />
          </RouteTransition>
        }
      />
    </Route>
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;
