'use client';

import "./globals.css";
import { LucideLayoutDashboard } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
// import { ThemeProvider } from "@/components/theme/theme-provider";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LucideLayoutDashboard,
  },
  {
    title: "Data Table",
    url: "/data",
    icon: LucideLayoutDashboard,
  },
]

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html suppressHydrationWarning lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <ThemeProvider> */}
        <AuthProvider>
          {!isLoginPage ? (
            <SidebarProvider defaultOpen={false}>
              <Sidebar>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {items.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <a href={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
              <main
                className="
                  min-h-screen flex-1
                  overflow-y-auto overflow-x-hidden
                  bg-secondary/20
                  flex flex-col">
                <Header />
                {children}
              </main>
            </SidebarProvider>
          ) : (
            <main className="min-h-screen">
              {children}
            </main>
          )}
        </AuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
