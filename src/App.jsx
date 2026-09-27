import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./home/home";
import RequestRefund from "./request-refund/request-refund";
import RequestList from "./request-list/request-list";
import AdminRequests from "./admin-request/admin-requests";
import Support from "./support/support.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/requests",
    element: <RequestList />,
  },
  {
    path: "/request-list",
    element: <AdminRequests />,
  },
  {
    path: "/request-refund",
    element: <RequestRefund />,
  },
  {
    path: "/admin",
    element: <Support />,
  },
  {
    path: "/admin/refunds/:id",
    element: <div>Refund Details</div>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
