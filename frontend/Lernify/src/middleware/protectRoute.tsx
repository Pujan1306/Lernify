import React from 'react';
import AppLayout from '../layout/AppLayout';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  
}

const ProtectRoute: React.FC<Props> = ({  }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
        <div className="flex flex-col gap-3 items-center justify-center h-screen">
            <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        );
    }
    return ( 
        <>
        {isAuthenticated ? (
            <AppLayout>
                <Outlet /> 
            </AppLayout>
        ) : (
            <Navigate to="/login" replace />
        )}
        </>
    );
    };

export default ProtectRoute;