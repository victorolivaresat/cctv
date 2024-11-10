import { Route, Routes, Navigate } from "react-router-dom";
import RouteTransition from "../utils/RouteTransition";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound/NotFound";
import Events from "../pages/Events/Events";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/Login";




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

/*

// Process Email Service
//const emailService = require("./app/services/emailServiceCctv");
const emailServiceR = require("./app/services/emailserviceTs");
setInterval(() => {
  const req = { io } ;
  //emailService.processEmailServer(req);
  //emailServiceR.processAndSaveEmails(req);
  emailServiceR.processEmailServer(req);
}, 20000);*/