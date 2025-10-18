import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import MainLayout from "../layout/MainLayout";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import Services from "../pages/Services/Services";
import AddServicePage from "../pages/Services/AddService";
import ServiceDetails from "../pages/Services/ServiceDetails";
import AboutUs from "../pages/About/AboutUs";
import Dashboard from "../pages/Dashboard/Dashboard";
import MyOrders from "../pages/Dashboard/User/MyOrders";
import AdminOrders from "../pages/Dashboard/Admin/AdminOrders";
import UnderConstruction from "../components/UnderConstruction";
import ContactUs from "../pages/Contact/ContactUs";
import Profile from "../pages/Dashboard/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <UnderConstruction></UnderConstruction>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/about",
        element: <AboutUs></AboutUs>,
      },
      {
        path: "/contact",
        element: <ContactUs></ContactUs>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/services",
        element: <Services></Services>,
      },
      {
        path: "/add-services",
        element: <AddServicePage></AddServicePage>,
      },
      {
        path: "/service-details/:id",
        element: <ServiceDetails></ServiceDetails>,
      },
      {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/my-orders",
        element: <MyOrders></MyOrders>,
      },
      {
        path: "/admin-orders",
        element: <AdminOrders></AdminOrders>,
      },
    ],
  },
]);
