import {createBrowserRouter} from "react-router-dom";
import {LandingPage} from "./pages/Landing";
import {DashboardPage} from "./pages/Dashboard";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/app',
        element: <DashboardPage />
    }
]);