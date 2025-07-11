import { FileUploader } from "@/components/file-uploader"
import TicketsTable from "@/components/tickets-table";

const HomePage = () => {
    return (
        <div className="m-10">
            <FileUploader />
            <div className="mt-10">
                <TicketsTable />
            </div>

        </div>

    )
}

export default HomePage;