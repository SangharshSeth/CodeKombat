import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/AuthSupabase'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { session, loading } = useAuthStore()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!session) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}