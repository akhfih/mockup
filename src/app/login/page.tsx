'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import { Spinner } from '@/components/spinner';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return <LoginForm />;
}
