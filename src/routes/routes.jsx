import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import MainLayout from "../layout/MainLayout";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import Services from "../pages/Services/Services";
import AddServicePage from "../pages/Services/AddService";
import ServiceDetails from "../pages/Services/ServiceDetails";
import AboutUs from "../pages/About/AboutUs";
import MyOrders from "../pages/Dashboard/User/MyOrders";
import AdminOrders from "../pages/Dashboard/Admin/AdminOrders";
import UnderConstruction from "../components/UnderConstruction";
import ContactUs from "../pages/Contact/ContactUs";
import Profile from "../pages/Dashboard/Profile";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import AllServices from "../pages/Dashboard/Admin/AllServices";
import ProxyIP from "../pages/OurServices/ProxyIP/ProxyIP";
import Dashboard from "../layout/Dashboard";
import AllWiseStocks from "../pages/Dashboard/Admin/AllWiseStocks";
import AddWiseStock from "../pages/Dashboard/Admin/AddWiseStock";
import WiseStockDetails from "../pages/Dashboard/Admin/WiseStockDetails";

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
        path: "/service-details/:id",
        element: <ServiceDetails></ServiceDetails>,
      },

      {
        path: "/my-orders",
        element: <MyOrders></MyOrders>,
      },     
      {
        path: "/Proxy",
        element: <ProxyIP></ProxyIP>,
      },
      {
        path: "/admin-users",
        element: <AllUsers></AllUsers>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "/dashboard",
        element: <AllWiseStocks></AllWiseStocks>,
      },
      {
        path: "admin-users",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "add-services",
        element: <AddServicePage></AddServicePage>,
      },
      {
        path: "admin-services",
        element: <AllServices></AllServices>,
      },
      {
        path: "admin-orders",
        element: <AdminOrders></AdminOrders>,
      },
      {
        path: "all-wise-stocks",
        element: <AllWiseStocks></AllWiseStocks>,
      },
      {
        path: "/dashboard/wise-stocks/:id",
        element: <WiseStockDetails></WiseStockDetails>,
      },
      {
        path: "add-wise-stocks",
        element: <AddWiseStock></AddWiseStock>,
      },
    ]
  },
]);
