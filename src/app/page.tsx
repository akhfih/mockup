import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <h2 className="text-lg">Home Page</h2>
      <Link href="/tickets" className="text-blue-500 hover:underline">
        Ticket 1
      </Link>
    </div>)
}

export default HomePage;