
import { ThemeSwitcher } from "./theme/theme-switcher";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
    return (
        <>
            <nav className="
  border-b bg-[#164396]
  w-full grid grid-cols-3 items-center py-2.5 px-5 rounded-b-2xl ">

                <div className="flex items-center gap-x-2">
                    <SidebarTrigger />

                </div>

                <div className="text-center">
                    <h1 className="text-lg font-semibold tracking-wide">
                        Dashboard TT
                    </h1>
                </div>

                <div className="flex justify-end items-center gap-x-2">
                    <div className="mr-2">
                        Last Updated Time
                        <br />
                        <span className="font-bold">7/2/2025 17:00</span>
                    </div>
                    <ThemeSwitcher />
                </div>
            </nav>

        </>
    )
}

export { Header };