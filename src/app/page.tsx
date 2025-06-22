import Link from "next/link";
import { ticketsPath } from "@/paths";

const HomePage = () => {
  return (
    <div>
      <h2 className="text-lg">Home Page</h2>
      <Link href={ticketsPath()} className="text-blue-500 hover:underline">
        Go to Tickets
      </Link>
    </div>)
}

export default HomePage;