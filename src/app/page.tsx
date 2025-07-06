// import Link from "next/link";
// import { ticketsPath } from "@/paths";

import { LucideTicket } from "lucide-react";
import MTTETrendChart from "@/components/chart/MTTETrendChart";
import MTTRTrendChart from "@/components/chart/MTTRTrendChart";
import RootCauseCriticalChart from "@/components/chart/RootCauseCriticalChart";
import RootCauseEmergencyChart from "@/components/chart/RootCauseEmergencyChart";
import RootCauseMajorChart from "@/components/chart/RootCauseMajorChart";
import TTTrendChart from "@/components/chart/TTTrendChart";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const HomePage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Site Down Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-white font-semibold">
          <span>Site Down</span>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md border border-[#164396]">
            <div className="text-sm font-bold">Total</div>
            <div className="text-3xl font-bold">322</div>
            <div className="text-sm font-bold">Site</div>
          </div>
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md border border-[#164396]">
            <div className="text-sm font-bold">Below 1 Hour</div>
            <div className="text-3xl font-bold">141</div>
            <div className="text-sm font-bold">Site</div>
          </div>
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md border border-[#164396]">
            <div className="text-sm font-bold">1-4 Hour</div>
            <div className="text-3xl font-bold">93</div>
            <div className="text-sm font-bold">Site</div>
          </div>
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md border border-[#164396]">
            <div className="text-sm font-bold">4-8 Hour</div>
            <div className="text-3xl font-bold">23</div>
            <div className="text-sm font-bold">Site</div>
          </div>
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md border border-[#164396]">
            <div className="text-sm font-bold">8-24 Hour</div>
            <div className="text-3xl font-bold">24</div>
            <div className="text-sm font-bold">Site</div>
          </div>
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg p-4 flex flex-col items-center justify-center shadow-md border border-[#164396]">
            <div className="text-sm font-bold">Above 24 Hour</div>
            <div className="text-3xl font-bold">41</div>
            <div className="text-sm font-bold">Site</div>
          </div>


        </div>
      </section>

      {/* Multiple Site Down TT Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2  font-semibold">

          <span>Multiple Site Down TT</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* Emergency Card */}
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">
            <div className="flex items-center space-x-2 font-semibold">
              <LucideTicket className="w-4 h-4" />
              <span className="text-sm  font-bold">Emergency</span>
            </div>
            <div className="grid grid-cols-4 text-center text-xs font-bold">
              <div>
                <span className="text-lg">0</span><br />
                <span className="text-gray-200 font-normal">Closed</span>
              </div>
              <div>
                <span className="text-lg">0</span><br />
                <span className="text-gray-200 font-normal">Running</span>
              </div>
              <div>
                <span className="text-lg">0</span><br />
                <span className="text-gray-200 font-normal">MTTE (min)</span>
              </div>
              <div>
                <span className="text-lg">0</span><br />
                <span className="text-gray-200 font-normal">MTTR (hrs)</span>
              </div>
            </div>
          </div>

          {/* Critical Card */}
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">
            <div className="flex items-center space-x-2">
              <LucideTicket className="w-4 h-4" />
              <span className="text-sm font-bold">Critical</span>
            </div>
            <div className="grid grid-cols-4 text-center text-xs font-bold">
              <div>
                <span className="text-lg">1</span><br />
                <span className="text-gray-200 font-normal">Closed</span>
              </div>
              <div>
                <span className="text-lg">0</span><br />
                <span className="text-gray-200 font-normal">Running</span>
              </div>
              <div>
                <span className="text-lg">6.4</span><br />
                <span className="text-gray-200 font-normal">MTTE (min)</span>
              </div>
              <div>
                <span className="text-lg">3.38</span><br />
                <span className="text-gray-200 font-normal">MTTR (hrs)</span>
              </div>
            </div>
          </div>

          {/* Major Card */}
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">
            <div className="flex items-center space-x-2">
              <LucideTicket className="w-4 h-4" />
              <span className="text-sm font-bold">Major</span>
            </div>
            <div className="grid grid-cols-4 text-center text-xs font-bold">
              <div>
                <span className="text-lg">8</span><br />
                <span className="text-gray-200 font-normal">Closed</span>
              </div>
              <div>
                <span className="text-lg">2</span><br />
                <span className="text-gray-200 font-normal">Running</span>
              </div>
              <div>
                <span className="text-lg">2.24</span><br />
                <span className="text-gray-200 font-normal">MTTE (min)</span>
              </div>
              <div>
                <span className="text-lg">1.57</span><br />
                <span className="text-gray-200 font-normal">MTTR (hrs)</span>
              </div>
            </div>
          </div>

          {/* POT Card */}
          <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">
            <div className="flex items-center space-x-2">
              <LucideTicket className="w-4 h-4" />
              <span className="text-sm font-bold">POT</span>
            </div>
            <div className="grid grid-cols-2 text-center text-xs font-bold">
              <div>
                <span className="text-lg">2</span><br />
                <span className="text-gray-200 font-normal">Closed</span>
              </div>
              <div>
                <span className="text-lg">1</span><br />
                <span className="text-gray-200 font-normal">Running</span>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Filters and Apply Button */}
      <section className="flex flex-wrap items-center gap-4 mt-4">
        {/* <select className="border border-gray-300 rounded px-3 py-1 text-sm">
          <option>Select Status</option>
          <option>Open</option>
          <option>Closed</option>
        </select> */}
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Open</SelectItem>
            <SelectItem value="system">Close</SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker placeholder="Date From" /> <span>to</span>
        <DateRangePicker placeholder="Date To" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Circle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Select Circle</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Select Region</SelectItem>
          </SelectContent>
        </Select>


        <Button className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-semibold">
          Apply
        </Button>

      </section>

      {/* Trends Section */}
      <section className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">

          <div className="bg-gray-100 bg-opacity-30 rounded p-4">

            <TTTrendChart />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">
          <div className="bg-gray-100 bg-opacity-30 rounded p-4">
            <MTTETrendChart />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">

          <div className="bg-gray-100 bg-opacity-30 rounded p-4">
            <MTTRTrendChart />
          </div>
        </div>
      </section>

      {/* Root Cause Section */}
      <section className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">

          <div className="bg-gray-100 bg-opacity-30 rounded p-4">
            <RootCauseEmergencyChart />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">

          <div className="bg-gray-100 bg-opacity-30 rounded p-4">
            <RootCauseCriticalChart />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">

          <div className="bg-gray-100 bg-opacity-30 rounded p-4">
            <RootCauseMajorChart />
          </div>
        </div>
      </section>


    </div>
  );
}

export default HomePage;