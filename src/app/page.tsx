// import Link from "next/link";
// import { ticketsPath } from "@/paths";


import type { EChartsOption } from 'echarts';
import MTTETrendChart from "@/components/chart/MTTETrendChart";
// import MTTRTrendChart from "@/components/chart/MTTRTrendChart";
import TTTrendChart from "@/components/chart/TTTrendChart";
import { EChart } from '@/components/echart/EChart';
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const optionBar: EChartsOption = {
  title: {
    text: 'Distribution of Electricity',
    subtext: 'Fake Data'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    // prettier-ignore
    data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} W'
    },
    axisPointer: {
      snap: true
    }
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces: [
      {
        lte: 6,
        color: 'green'
      },
      {
        gt: 6,
        lte: 8,
        color: 'red'
      },
      {
        gt: 8,
        lte: 14,
        color: 'green'
      },
      {
        gt: 14,
        lte: 17,
        color: 'red'
      },
      {
        gt: 17,
        color: 'green'
      }
    ]
  },
  series: [
    {
      name: 'Electricity',
      type: 'line',
      smooth: true,
      // prettier-ignore
      data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
      markArea: {
        itemStyle: {
          color: 'rgba(255, 173, 177, 0.4)'
        },
        data: [
          [
            {
              name: 'Morning Peak',
              xAxis: '07:30'
            },
            {
              xAxis: '10:00'
            }
          ],
          [
            {
              name: 'Evening Peak',
              xAxis: '17:30'
            },
            {
              xAxis: '21:15'
            }
          ]
        ]
      }
    }
  ]
}

const HomePage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Site Down Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        {/* Kiri - Enterprise */}
        <section className="space-y-4 rounded-lg shadow-md p-2 pt-0 bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396]">
          <div className="bg-[#164396] text-white text-xl font-semibold text-center w-1/2 py-2 rounded-b-2xl mb-3 mx-auto shadow-xl/30">
            <span>Enterprise</span>
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dayly">Dayly</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {/* Kiri */}
            <div className="space-y-4 ">
              <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg shadow-md border border-[#164396] overflow-hidden">
                {/* Header */}
                <div className="bg-[#164396] text-white text-xl font-semibold text-center py-1 mx-10 rounded-b-2xl mb-3 shadow-xl/30">
                  OOS
                </div>
                {/* Isi card */}
                <div className="grid grid-cols-3 gap-2 p-2">
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 ">
                    <div className="text-xs font-bold">Total</div>
                    <div className="text-2xl font-bold">32</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold">323</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold">16322300</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold">322</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold">322</div>
                    <div className="text-xs">Site</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanan */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg shadow-md border border-[#164396] overflow-hidden">
                {/* Header */}
                <div className="bg-[#164396] text-white text-xl font-semibold text-center py-1 mx-10 rounded-b-2xl mb-3">
                  Others
                </div>

                {/* Isi card */}
                <div className="grid grid-cols-3 gap-2 p-2">
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 ">
                    <div className="text-xs font-bold">Total</div>
                    <div className="text-2xl font-bold">32</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold">323</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold">16322300</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold">322</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold">322</div>
                    <div className="text-xs">Site</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kanan - Partnership */}
        <section className="space-y-4 rounded-lg shadow-md p-2 pt-0 bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396]">
          <div className="bg-[#164396] text-white text-xl font-semibold text-center w-1/2 py-2 rounded-b-2xl mb-3 mx-auto">
            <span>Partnership</span>
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Open</SelectItem>
              <SelectItem value="system">Close</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Kiri */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg shadow-md border border-[#164396] overflow-hidden">
                {/* Header */}
                <div className="bg-[#164396] text-white text-xl font-semibold text-center py-1 mx-10 rounded-b-2xl mb-3">
                  OOS
                </div>
                {/* Isi card */}
                <div className="grid grid-cols-3 gap-2 p-2">
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 ">
                    <div className="text-xs font-bold">Total</div>
                    <div className="text-2xl font-bold">32</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold">323</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold">16322300</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold">322</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold">322</div>
                    <div className="text-xs">Site</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanan */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg shadow-md border border-[#164396] overflow-hidden">
                {/* Header */}
                <div className="bg-[#164396] text-white text-xl font-semibold text-center py-1 mx-10 rounded-b-2xl mb-3">
                  Others
                </div>

                {/* Isi card */}
                <div className="grid grid-cols-3 gap-2 p-2">
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 ">
                    <div className="text-xs font-bold">Total</div>
                    <div className="text-2xl font-bold">32</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold">323</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold">16322300</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold">322</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold">322</div>
                    <div className="text-xs">Site</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>





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
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}

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
            <EChart option={optionBar} />
          </div>
        </div>
      </section>
    </div>


  );
}

export default HomePage;