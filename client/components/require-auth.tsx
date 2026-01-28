'use client';

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
    children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            const token = Cookies.get("access-token");

            if (!token) {
                router.replace("/auth/signin");
            } else {
                setIsAuth(true);
            }
        }, 500);
    }, []);

    if (isAuth === null) {
        return (
            <div className="flex justify-center gap-2 items-center h-full min-h-[85vh]">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <p className="text-lg">Carregando...</p>
            </div>
        );
    }

    return <>{children}</>;
}