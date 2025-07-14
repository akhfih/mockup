'use client';

import type { EChartsOption } from 'echarts';
import { Loader2 } from "lucide-react";
import { useEffect, useState } from 'react';
// import MTTETrendChart from "@/components/chart/MTTETrendChart";
// import MTTRTrendChart from "@/components/chart/MTTRTrendChart";
// import TTTrendChart from "@/components/chart/TTTrendChart";
import { EChart } from '@/components/echart/EChart';
import { Button } from "@/components/ui/button";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPreviousYears } from '@/lib/dateUtils';
import { ChartFilters, ChartResponse, DashboardFilters, dashboardService } from '@/services/dashboardService';
import { DashboardResponse } from '@/types/dashboard';

// const optionBar: EChartsOption = {
//   title: {
//     text: 'Distribution of Electricity',
//     subtext: 'Fake Data'
//   },
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'cross'
//     }
//   },
//   toolbox: {
//     show: true,
//     feature: {
//       saveAsImage: {}
//     }
//   },
//   xAxis: {
//     type: 'category',
//     boundaryGap: false,
//     // prettier-ignore
//     data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
//   },
//   yAxis: {
//     type: 'value',
//     axisLabel: {
//       formatter: '{value} W'
//     },
//     axisPointer: {
//       snap: true
//     }
//   },
//   visualMap: {
//     show: false,
//     dimension: 0,
//     pieces: [
//       {
//         lte: 6,
//         color: 'green'
//       },
//       {
//         gt: 6,
//         lte: 8,
//         color: 'red'
//       },
//       {
//         gt: 8,
//         lte: 14,
//         color: 'green'
//       },
//       {
//         gt: 14,
//         lte: 17,
//         color: 'red'
//       },
//       {
//         gt: 17,
//         color: 'green'
//       }
//     ]
//   },
//   series: [
//     {
//       name: 'Electricity',
//       type: 'line',
//       smooth: true,
//       // prettier-ignore
//       data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
//       markArea: {
//         itemStyle: {
//           color: 'rgba(255, 173, 177, 0.4)'
//         },
//         data: [
//           [
//             {
//               name: 'Morning Peak',
//               xAxis: '07:30'
//             },
//             {
//               xAxis: '10:00'
//             }
//           ],
//           [
//             {
//               name: 'Evening Peak',
//               xAxis: '17:30'
//             },
//             {
//               xAxis: '21:15'
//             }
//           ]
//         ]
//       }
//     }
//   ]
// }

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [yearlyChartData, setYearlyChartData] = useState<ChartResponse | null>(null);
  const [weeklyChartData, setWeeklyChartData] = useState<ChartResponse | null>(null);
  const [dailyChartData, setDailyChartData] = useState<ChartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [yearlyChartLoading, setYearlyChartLoading] = useState(false);
  const [weeklyChartLoading, setWeeklyChartLoading] = useState(false);
  const [dailyChartLoading, setDailyChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const years = getPreviousYears(4);

  // Dashboard filters
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>('all_time');

  // Chart filters (shared across all charts)
  const [linkType, setLinkType] = useState<'enterprise' | 'wholesale' | 'all'>('all');
  const [customerName, setCustomerName] = useState('');
  const [linkId, setLinkId] = useState('');

  const fetchDashboardData = async (filters?: DashboardFilters) => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData(filters);
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyChartData = async (filters: ChartFilters) => {
    try {
      setYearlyChartLoading(true);
      console.log("Sending yearly chart filters:", JSON.stringify(filters, null, 2));
      const data = await dashboardService.getChartData(filters);
      console.log("Received yearly chart data:", JSON.stringify(data, null, 2));
      setYearlyChartData(data);
    } catch (err) {
      console.error('Yearly chart data fetch error:', err);
    } finally {
      setYearlyChartLoading(false);
    }
  };

  const fetchWeeklyChartData = async (filters: ChartFilters) => {
    try {
      setWeeklyChartLoading(true);
      console.log("Sending weekly chart filters:", JSON.stringify(filters, null, 2));
      const data = await dashboardService.getChartData(filters);
      console.log("Received weekly chart data:", JSON.stringify(data, null, 2));
      setWeeklyChartData(data);
    } catch (err) {
      console.error('Weekly chart data fetch error:', err);
    } finally {
      setWeeklyChartLoading(false);
    }
  };

  const fetchDailyChartData = async (filters: ChartFilters) => {
    try {
      setDailyChartLoading(true);
      console.log("Sending daily chart filters:", JSON.stringify(filters, null, 2));
      const data = await dashboardService.getChartData(filters);
      console.log("Received daily chart data:", JSON.stringify(data, null, 2));
      setDailyChartData(data);
    } catch (err) {
      console.error('Daily chart data fetch error:', err);
    } finally {
      setDailyChartLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Initial chart data fetch for all three charts
    fetchYearlyChartData({
      chart_type: 'yearly',
      link_type: linkType,
      years: years
    });

    fetchWeeklyChartData({
      chart_type: 'weekly',
      link_type: linkType,
      weeks_back: [1, 2, 3, 4]
    });

    fetchDailyChartData({
      chart_type: 'daily',
      link_type: linkType,
      days_back: [1, 7, 14]
    });
  }, []);

  const handleDashboardFilterApply = () => {
    fetchDashboardData({ time_filter: timeFilter });
  };

  const handleChartFilterApply = () => {
    const baseFilters = {
      link_type: linkType,
      ...(customerName && { customer_name: customerName }),
      ...(linkId && { link_id: linkId })
    };

    // Fetch data for all three charts with their specific parameters
    fetchYearlyChartData({
      ...baseFilters,
      chart_type: 'yearly',
      years: years
    });

    fetchWeeklyChartData({
      ...baseFilters,
      chart_type: 'weekly',
      weeks_back: [1, 2, 3, 4]
    });

    fetchDailyChartData({
      ...baseFilters,
      chart_type: 'daily',
      days_back: [1, 7, 14]
    });
  };

  // Generate ECharts option from API data (styled like TTTrendChart)
  const generateChartOption = (data: ChartResponse): EChartsOption => {
    return {
      title: {
        text: data.title,
        left: 'left',
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {}
        }
      },
      legend: {
        bottom: 0,
        type: 'scroll',
        data: data.series.map(s => s.name),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: data.x_axis_labels,
        // axisLabel: {
        //   interval: 1 // <-- Ini penting agar semua label ditampilkan
        // }
      },
      yAxis: {
        type: 'value',
        name: 'Total       ',
      },
      series: data.series.map(series => ({
        name: series.name,
        type: 'line',
        data: series.data.map(d => d.value),
        color: series.color,
        smooth: false,
      }))
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-30 w-30 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">No data available</div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      {/* Site Down Section */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={timeFilter} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'all_time') => setTimeFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Last 4 Days</SelectItem>
            <SelectItem value="weekly">Last 4 Weeks</SelectItem>
            <SelectItem value="monthly">Last 4 Months</SelectItem>
            <SelectItem value="all_time">All Time</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleDashboardFilterApply} disabled={loading} className="text-white bg-[#164396]">
          {loading ? "Applying..." : "Apply"}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        {/* Kiri - Enterprise */}
        <section className="space-y-4 rounded-lg shadow-md p-2 pt-0 bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396]">
          <div className="bg-[#164396] text-white text-xl font-semibold text-center w-1/2 py-2 rounded-b-2xl mb-3 mx-auto shadow-xl/30">
            <span>Enterprise</span>
          </div>
          {/* <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dayly">Dayly</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select> */}
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
                    <div className="text-2xl font-bold">{dashboardData.enterprise.oos.total}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.oos.mttr_breakdown.below_1_hour}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.oos.mttr_breakdown.hour_1_to_4}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.oos.mttr_breakdown.hour_4_to_8}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.oos.mttr_breakdown.hour_8_to_24}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.oos.mttr_breakdown.above_24_hour}</div>
                    <div className="text-xs">Site</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanan */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg shadow-md border border-[#164396] overflow-hidden">
                {/* Header */}
                <div className="bg-[#164396] text-white text-xl font-semibold text-center py-1 mx-10 rounded-b-2xl mb-3 shadow-xl/30">
                  Others
                </div>

                {/* Isi card */}
                <div className="grid grid-cols-3 gap-2 p-2">
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 ">
                    <div className="text-xs font-bold">Total</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.others.total}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.others.mttr_breakdown.below_1_hour}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.others.mttr_breakdown.hour_1_to_4}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.others.mttr_breakdown.hour_4_to_8}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.others.mttr_breakdown.hour_8_to_24}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.enterprise.others.mttr_breakdown.above_24_hour}</div>
                    <div className="text-xs">Site</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kanan - Partnership */}
        <section className="space-y-4 rounded-lg shadow-md p-2 pt-0 bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396]">
          <div className="bg-[#164396] text-white text-xl font-semibold text-center w-1/2 py-2 rounded-b-2xl mb-3 mx-auto shadow-xl/30">
            <span>Partnership</span>
          </div>
          {/* <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Open</SelectItem>
              <SelectItem value="system">Close</SelectItem>
            </SelectContent>
          </Select> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Kiri */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg shadow-md border border-[#164396] overflow-hidden">
                {/* Header */}
                <div className="bg-[#164396] text-white text-xl font-semibold text-center py-1 mx-10 rounded-b-2xl mb-3 shadow-xl/30">
                  OOS
                </div>
                {/* Isi card */}
                <div className="grid grid-cols-3 gap-2 p-2">
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 ">
                    <div className="text-xs font-bold">Total</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.oos.total}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.oos.mttr_breakdown.below_1_hour}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.oos.mttr_breakdown.hour_1_to_4}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.oos.mttr_breakdown.hour_4_to_8}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.oos.mttr_breakdown.hour_8_to_24}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.oos.mttr_breakdown.above_24_hour}</div>
                    <div className="text-xs">Site</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanan */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] text-white rounded-lg shadow-md border border-[#164396] overflow-hidden">
                {/* Header */}
                <div className="bg-[#164396] text-white text-xl font-semibold text-center py-1 mx-10 rounded-b-2xl mb-3 shadow-xl/30">
                  Others
                </div>

                {/* Isi card */}
                <div className="grid grid-cols-3 gap-2 p-2">
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 ">
                    <div className="text-xs font-bold">Total</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.others.total}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.others.mttr_breakdown.below_1_hour}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.others.mttr_breakdown.hour_1_to_4}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.others.mttr_breakdown.hour_4_to_8}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.others.mttr_breakdown.hour_8_to_24}</div>
                    <div className="text-xs">Site</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold">{dashboardData.partnership.others.mttr_breakdown.above_24_hour}</div>
                    <div className="text-xs">Site</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>





      {/* Dashboard Filters */}
      {/* <section className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-4">
        <h3 className="text-white text-lg font-semibold">Dashboard Filters</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Select value={timeFilter} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'all_time') => setTimeFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Last 4 Days</SelectItem>
              <SelectItem value="weekly">Last 4 Weeks</SelectItem>
              <SelectItem value="monthly">Last 4 Months</SelectItem>
              <SelectItem value="all_time">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleDashboardFilterApply} disabled={loading} className="text-white">
            {loading ? "Applying..." : "Apply Dashboard Filter"}
          </Button>
        </div>
      </section > */}

      {/* Chart Filters */}
      <section className="p-4 px-0 space-y-4">
        <h3 className="text-white text-lg font-semibold">Chart Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="link-type" className="text-sm font-medium text-white">
              Link Type
            </Label>
            <Select value={linkType} onValueChange={(value: 'enterprise' | 'wholesale' | 'all') => setLinkType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="wholesale">Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-name" className="text-sm font-medium text-white">
              Customer Name
            </Label>
            <Input
              id="customer-name"
              type="text"
              placeholder="Filter by customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-id" className="text-sm font-medium text-white">
              Link ID
            </Label>
            <Input
              id="link-id"
              type="text"
              placeholder="Filter by link ID"
              value={linkId}
              onChange={(e) => setLinkId(e.target.value)}
            />
          </div>

          <div className="space-y-2 w-30">
            <Label className="text-sm font-medium text-white invisible">Apply</Label>
            <Button
              onClick={handleChartFilterApply}
              disabled={yearlyChartLoading || weeklyChartLoading || dailyChartLoading}
              className="w-full text-white px-4 py-2 text-sm font-semibold bg-[#164396]"
            >
              {(yearlyChartLoading || weeklyChartLoading || dailyChartLoading) ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      </section>

      {/* Trends Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Chart */}
        <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">
          <h4 className="text-white text-lg font-semibold text-center">Daily Trend</h4>
          <div className="bg-gray-100 bg-opacity-30 rounded p-4">
            {dailyChartData ? (
              <div style={{ height: 250 }}>
                <EChart option={generateChartOption(dailyChartData)} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                {dailyChartLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                ) : (
                  <div className="text-white">No daily data available</div>
                )}
              </div>
            )}
          </div>
        </div>


        {/* Weekly Chart */}
        <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">
          <h4 className="text-white text-lg font-semibold text-center">Weekly Trend</h4>
          <div className="bg-gray-100 bg-opacity-30 rounded p-4">
            {weeklyChartData ? (
              <div style={{ height: 250 }}>
                <EChart option={generateChartOption(weeklyChartData)} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                {weeklyChartLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                ) : (
                  <div className="text-white">No weekly data available</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Yearly Chart */}
        <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-4 space-y-3 text-white">
          <h4 className="text-white text-lg font-semibold text-center">Yearly Trend</h4>
          <div className="bg-gray-100 bg-opacity-30 rounded p-4">
            {yearlyChartData ? (
              <div style={{ height: 250 }}>
                <EChart option={generateChartOption(yearlyChartData)} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                {yearlyChartLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                ) : (
                  <div className="text-white">No yearly data available</div>
                )}
              </div>
            )}
          </div>
        </div>


      </section>
    </div >


  );
}

export default HomePage;