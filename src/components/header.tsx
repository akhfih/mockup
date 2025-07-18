
'use client';

import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <>
            <nav className="
  border-b bg-[#164396]
  w-full grid grid-cols-3 items-center py-4 px-5 rounded-b-2xl ">

                <div className="flex items-center gap-x-2">
                    <SidebarTrigger />

                </div>

                <div className="text-center">
                    <h1 className="text-lg font-semibold tracking-wide">
                        Dashboard TT
                    </h1>
                </div>

                <div className="flex justify-end items-center gap-x-2">
                    {isAuthenticated && user && (
                        <>
                            <div className="flex items-center gap-2 mr-4 text-white">
                                <User size={16} />
                                <span className="text-sm">{user.username}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="text-white hover:bg-white/10"
                            >
                                <LogOut size={16} />
                            </Button>
                        </>
                    )}
                    {/* <div className="mr-2 p-5">
                         Last Updated Time
                        <br />
                        <span className="font-bold">7/2/2025 17:00</span> 
                    </div> */}
                    {/* <ThemeSwitcher /> */}
                </div>
            </nav>

        </>
    )
}

export { Header };