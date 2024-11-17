import {createBrowserRouter} from "react-router-dom";
import {LandingPage} from "./pages/Landing";
import {CodingEnvironment} from "@/pages/CodingEnvironment.tsx";
import {RootLayout} from "@/RootLayout.tsx";
import {TermsAndConditions} from "@/pages/T&C.tsx";
import {DashBoardLayout} from "@/DashBoardLayout.tsx";
import PreMatch from "@/pages/PreMatch.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />
            },
            {
                path: "/terms-and-conditions",
                element: <TermsAndConditions />
            }
        ]
    },
    {
        path: '/app',
        element: <DashBoardLayout/>,
        children: [
            {
                index: true,
                element: <PreMatch />
            },
            {
                path: "start-match",
                element: <CodingEnvironment />
            }
        ]
    },

]);