import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { IndexPage } from "./pages/Index";
import { PurchasePage } from "./pages/Purchase";
import { ViewPage } from "./pages/View";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/purchase",
    element: <PurchasePage />,
  },
  {
    path: "/view",
    element: <ViewPage />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
