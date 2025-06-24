import { LucideKanban } from "lucide-react";
import Link from "next/link";
import { homePath, ticketsPath } from "@/paths";
import { ThemeSwitcher } from "./theme/theme-switcher";
import { Button, buttonVariants } from "./ui/button";

const Header = () => {
    return (
        <>
            <nav className="
            supports:backdrop-blur:bg-background/50
            fixed left-0 right-0 top-0 z-20
            border-b bg-background/50 backdrop-blur
            w-full flex justify-between py-2.5 px-5">
                <div>
                    <Button asChild variant="ghost">
                        <Link href={homePath()} className="text-lg font-bold">
                            <LucideKanban />
                            <h1 className="text-lg font-semibold">TicketBounty</h1></Link>
                    </Button>
                </div>
                <div className="flex  align-items gap-x-2">
                    <ThemeSwitcher />
                    <Link href={ticketsPath()} className={buttonVariants({ variant: "default" })}>Tickets</Link>
                </div>
            </nav>
        </>
    )
}

export { Header };