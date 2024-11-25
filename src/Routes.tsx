import {createBrowserRouter} from "react-router-dom";
import {RootLayout} from "@/RootLayout.tsx";
import {DashBoardLayout} from "@/DashBoardLayout.tsx";
import React, {lazy, Suspense} from "react";
import {LoadingSpinner} from "@/components/LoadingSpinner.tsx";
import {AlertCircle} from "lucide-react";
import {ProtectedRoute} from './components/ProtectedRoute.tsx';

const LandingPage = lazy(() => import("./pages/Landing"));
const TermsAndConditions = lazy(() => import("./pages/T&C"));
const PreMatch = lazy(() => import("./pages/PreMatch.tsx"));
const CodingEnvironment = lazy(() => import("./pages/CodingEnvironment"));
const Results = lazy(() => import("./pages/Results"));
const ProfilePage = lazy(() => import("./pages/Profile.tsx"))

const withSuspense = (Component: React.ComponentType) => (
    <Suspense fallback={<LoadingSpinner/>}>
        <Component/>
    </Suspense>
);

const ErrorBoundary = () => (
    <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-4">
        <div className="max-w-md w-full space-y-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500"/>
            <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
            <p className="text-gray-300">
                You Should not be at this route! Go home!
            </p>
        </div>
    </div>
)

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        errorElement: <ErrorBoundary/>,
        children: [
            {
                index: true,
                element: withSuspense(LandingPage)
            },
            {
                path: "/terms-and-conditions",
                element: withSuspense(TermsAndConditions)
            }
        ]
    },
    {
        path: '/app',
        element: (
            <DashBoardLayout/>

        ),
        children: [
            {
                index: true,
                element: withSuspense(PreMatch)
            },
            {
                path: "start-match",
                element: withSuspense(CodingEnvironment)
            },
            {
                path: "profile",
                element: withSuspense(ProfilePage)
            },
            {
                path: "results",
                element: withSuspense(Results)
            },
        ]
    },
]);