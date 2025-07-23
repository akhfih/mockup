'use client';

import { format } from 'date-fns';
// import type { EChartsOption } from 'echarts';
import { Loader2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { DateTimePicker } from '@/components/datetime-picker/datetime-picker';
import { SimpleTimePicker } from '@/components/datetime-picker/simple-time-picker';
// import { EChart } from '@/components/echart/EChart';
import ChartSection from '@/components/features/dashboard/ChartSection';
import { ProtectedRoute } from '@/components/protected-route';
import { AsyncPaginateSelect } from '@/components/ui/AsyncPaginateSelect';
import { Button } from "@/components/ui/button";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createLoadOptions } from '@/lib/asyncPaginateHelpers';
import { getPreviousYears } from '@/lib/dateUtils';
import { ChartFilters, ChartResponse, DashboardFilters, dashboardService } from '@/services/dashboardService';
import { DashboardResponse } from '@/types/dashboard';

const HomePage = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  // const [yearlyChartData, setYearlyChartData] = useState<ChartResponse | null>(null);
  // const [weeklyChartData, setWeeklyChartData] = useState<ChartResponse | null>(null);
  // const [dailyChartData, setDailyChartData] = useState<ChartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // const [yearlyChartLoading, setYearlyChartLoading] = useState(false);
  // const [weeklyChartLoading, setWeeklyChartLoading] = useState(false);
  // const [dailyChartLoading, setDailyChartLoading] = useState(false);
  const [chartFilterLoading, setChartFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createFromDate, setCreateFromDate] = useState<Date | undefined>(undefined);
  const [createFromTime, setCreateFromTime] = useState<Date | undefined>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [createEndDate, setCreateEndDate] = useState<Date | undefined>(undefined);
  const [createEndTime, setCreateEndTime] = useState<Date | undefined>(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 0);
    return now;
  });

  const handleDashboardFilterReset = () => {
    setCreateFromDate(undefined);
    setCreateFromTime(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    });
    setCreateEndDate(undefined);
    setCreateEndTime(() => {
      const now = new Date();
      now.setHours(23, 59, 59, 0);
      return now;
    });
    setCustomerName('');
    setLinkId('');
    // Langsung apply filter default
    fetchDashboardData();
  };

  const handleChartFilterReset = () => {
    setLinkType('all');
    setChartCustomerName('');
    setChartLinkId('');
    // Langsung apply filter default chart
    fetchYearlyChartData({
      chart_type: 'yearly',
      link_type: 'all',
      years: years
    });
    fetchWeeklyChartData({
      chart_type: 'weekly',
      link_type: 'all',
      weeks_back: [1, 2, 3, 4]
    });
    fetchDailyChartData({
      chart_type: 'daily',
      link_type: 'all',
      days_back: [1, 2]
    });
  };

  const years = getPreviousYears(4);

  // Dashboard filters
  // const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>('all_time');


  // Chart filters (shared across all charts)
  const [linkType, setLinkType] = useState<'enterprise' | 'wholesale' | 'all'>('all');
  // Dashboard filters
  const [customerName, setCustomerName] = useState('');
  const [linkId, setLinkId] = useState('');
  useEffect(() => {
    setLinkId("");
  }, [customerName]);

  // Chart-specific filters (independent from dashboard)
  const [chartCustomerName, setChartCustomerName] = useState('');
  const [chartLinkId, setChartLinkId] = useState('');
  useEffect(() => {
    setChartLinkId("");
  }, [chartCustomerName]);

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

  // const fetchYearlyChartData = async (filters: ChartFilters) => {
  //   try {
  //     // setYearlyChartLoading(true);
  //     // // console.log("Sending yearly chart filters:", JSON.stringify(filters, null, 2));
  //     // const data = await dashboardService.getChartData(filters);
  //     // // console.log("Received yearly chart data:", JSON.stringify(data, null, 2));
  //     // setYearlyChartData(data);
  //   } catch (err) {
  //     console.error('Yearly chart data fetch error:', err);
  //   } finally {
  //     setYearlyChartLoading(false);
  //   }
  // };

  // const fetchWeeklyChartData = async (filters: ChartFilters) => {
  //   try {
  //     setWeeklyChartLoading(true);
  //     // console.log("Sending weekly chart filters:", JSON.stringify(filters, null, 2));
  //     // const data = await dashboardService.getChartData(filters);
  //     // // console.log("Received weekly chart data:", JSON.stringify(data, null, 2));
  //     // setWeeklyChartData(data);
  //   } catch (err) {
  //     console.error('Weekly chart data fetch error:', err);
  //   } finally {
  //     setWeeklyChartLoading(false);
  //   }
  // };

  // const fetchDailyChartData = async (filters: ChartFilters) => {
  //   try {
  //     setDailyChartLoading(true);
  //     // console.log("Sending daily chart filters:", JSON.stringify(filters, null, 2));
  //     const data = await dashboardService.getChartData(filters);
  //     // console.log("Received daily chart data:", JSON.stringify(data, null, 2));
  //     setDailyChartData(data);
  //     // console.log("Data Fetch" + data.data);
  //   } catch (err) {
  //     console.error('Daily chart data fetch error:', err);
  //   } finally {
  //     setDailyChartLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchDashboardData();

    // // Initial chart data fetch for all three charts
    // fetchYearlyChartData({
    //   chart_type: 'yearly',
    //   link_type: linkType,
    //   years: years
    // });

    // fetchWeeklyChartData({
    //   chart_type: 'weekly',
    //   link_type: linkType,
    //   weeks_back: [1, 2, 3, 4]
    // });

    // fetchDailyChartData({
    //   chart_type: 'daily',
    //   link_type: linkType,
    //   days_back: [1, 2, 3],
    //   current_date: '2025-01-31'
    // });
  }, []);

  useEffect(() => {
    // Update chart data when dashboard data changes
    console.log("from Date " + createFromDate + " to " + createEndDate);
    console.log("from Time " + createFromTime + " to " + createEndTime);
  }, [dashboardData, createFromDate])

  const handleDashboardFilterApply = async () => {
    setLoading(true);
    try {
      const create_from = createFromDate
        ? `${createFromDate.getFullYear()}-${String(createFromDate.getMonth() + 1).padStart(2, '0')}-${String(createFromDate.getDate()).padStart(2, '0')} ${createFromTime ? format(createFromTime, 'HH:mm:ss') : '00:00:00'}`
        : undefined;

      const create_end = createEndDate
        ? `${createEndDate.getFullYear()}-${String(createEndDate.getMonth() + 1).padStart(2, '0')}-${String(createEndDate.getDate()).padStart(2, '0')} ${createEndTime ? format(createEndTime, 'HH:mm:ss') : '23:59:59'}`
        : undefined;

      alert(create_from + " " + create_end);
      await fetchDashboardData({
        // time_filter: timeFilter,
        create_from,
        create_end,
        ...(customerName && { customer_name: customerName }),
        ...(linkId && { link_id: linkId })
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleChartFilterApply = async () => {
  //   setChartFilterLoading(true);
  //   const baseFilters = {
  //     link_type: linkType,
  //     ...(chartCustomerName && { customer_name: chartCustomerName }),
  //     ...(chartLinkId && { link_id: chartLinkId })
  //   };
  //   try {
  //     await Promise.all([
  //       fetchYearlyChartData({
  //         ...baseFilters,
  //         chart_type: 'yearly',
  //         years: years
  //       }),
  //       fetchWeeklyChartData({
  //         ...baseFilters,
  //         chart_type: 'weekly',
  //         weeks_back: [1, 2, 3, 4]
  //       }),
  //       fetchDailyChartData({
  //         ...baseFilters,
  //         chart_type: 'daily',
  //         days_back: [1, 2]
  //       })
  //     ]);
  //   } finally {
  //     setChartFilterLoading(false);
  //   }
  // };

  // Generate ECharts option from API data (styled like TTTrendChart)
  // const generateChartOption = (data: ChartResponse): EChartsOption => {
  //   // Always show legend, even if data is empty
  //   const legendData = data && data.series && data.series.length > 0
  //     ? data.series.map(s => s.name)
  //     : ["Data"];

  //   const seriesData = data.series[0].data.map(item => {
  //     // Konversi value hh:mm:ss menjadi total detik
  //     const [hh, mm, ss] = item.value.split(':').map(Number);
  //     return (hh * 3600) + (mm * 60) + ss;
  //   });

  //   // console.log("seriesData", seriesData);
  //   return {
  //     // backgroundColor: '#1f1f1f',
  //     title: {
  //       text: data.title,
  //       left: 'left',
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       // Show all compared series in tooltip
  //       formatter: (params: any) => {
  //         const paramArray = Array.isArray(params) ? params : [params];
  //         const label = paramArray[0]?.axisValueLabel || paramArray[0]?.axisValue || '';
  //         const lines = [`${label}`];
  //         for (const p of paramArray) {
  //           const seconds = typeof p.value === 'number' ? p.value : 0;
  //           const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  //           const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  //           const s = (seconds % 60).toString().padStart(2, '0');
  //           lines.push(
  //             `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background:${(p as any).color};"></span> ${(p as any).seriesName}: ${h}:${m}:${s}`
  //           );
  //         }
  //         return lines.join('<br/>');
  //       }
  //     },
  //     toolbox: {
  //       show: true,
  //       feature: {
  //         saveAsImage: {}
  //       }
  //     },
  //     legend: {
  //       show: true,
  //       bottom: 0,
  //       type: 'scroll',
  //       data: legendData,
  //     },
  //     grid: {
  //       left: '3%',
  //       right: '4%',
  //       bottom: '15%',
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: 'category',
  //       boundaryGap: true,
  //       data: data.x_axis_labels,
  //       axisLabel: { rotate: 70, interval: 0, fontSize: 9, },
  //     },
  //     yAxis: {
  //       type: 'value',
  //       name: 'Hour  ',
  //       axisLabel: {
  //         formatter: (val) => {
  //           // Tampilkan sebagai "X jam Y menit"
  //           const h = Math.floor(val / 3600);

  //           return `${h}`
  //         },

  //       }
  //     },
  //     series: (data.series && data.series.length > 0)
  //       ? data.series.map(series => ({
  //         name: series.name,
  //         type: 'line',
  //         data: series.data.map(item => {
  //           const [hh, mm, ss] = (item.value || item.value || "00:00:00").split(':').map(Number);
  //           return (hh * 3600) + (mm * 60) + ss;
  //         }),
  //         color: series.color,
  //         smooth: false,
  //       }))
  //       : [{
  //         name: 'Data',
  //         type: 'line',
  //         data: [],
  //         color: '#888',
  //         smooth: false,
  //       }]
  //   };
  // };

  // Remove global loading screen so dashboard always renders

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!dashboardData && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">No data available</div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      {/* T  T Down Section */}
      <div className="flex flex-wrap  gap-4">
        {/* <Select value={timeFilter} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'all_time') => setTimeFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Last 4 Days</SelectItem>
            <SelectItem value="weekly">Last 4 Weeks</SelectItem>
            <SelectItem value="monthly">Last 4 Months</SelectItem>
            <SelectItem value="all_time">All Time</SelectItem>
          </SelectContent>
        </Select> */}

        <div className="space-y-2">
          <Label htmlFor="link-type" className="text-sm font-medium text-white">
            Create From
          </Label>
          <div className="flex items-center gap-2 w-full">

            <DateTimePicker
              value={createFromDate}
              onChange={(date: Date | undefined) =>
                setCreateFromDate(date)
              }
              hideTime={true}
              placeholder='Create From Date'
              className='w-full'
            />
            <SimpleTimePicker
              value={createFromTime ?? new Date()}
              onChange={setCreateFromTime}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="link-type" className="text-sm font-medium text-white">
            Create End
          </Label>
          <div className="flex items-center gap-2">

            <DateTimePicker
              value={createEndDate}
              onChange={(date: Date | undefined) =>
                setCreateEndDate(date)
              }
              hideTime={true}
              placeholder='Create End'
              className='w-full'
            />
            <SimpleTimePicker
              value={createEndTime ?? new Date()}
              onChange={setCreateEndTime}
            />

          </div>
        </div>



        <div className="space-y-2">
          <Label htmlFor="link-type" className="text-sm font-medium text-white">
            Customer Name
          </Label>
          <div className='flex items-center gap-4 w-full'>
            <AsyncPaginateSelect
              value={customerName ? { label: customerName, value: customerName } : null}
              onChange={(option) => setCustomerName(option ? option.value : '')}
              loadOptions={createLoadOptions<{ label: string; value: string }>('http://localhost:8000/search/customer-name')}
              placeholder="Customer Name"
              debounceTimeout={400}
            />

          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="link-id" className="text-sm font-medium text-white">
            Link ID
          </Label>
          <div className='flex items-center gap-4 w-full'>
            <AsyncPaginateSelect
              key={customerName || 'no-customer'}
              value={linkId ? { label: linkId, value: linkId } : null}
              onChange={(option) => setLinkId(option ? option.value : '')}
              loadOptions={async (inputValue, loadedOptions, additional) => {
                const axios = (await import('axios')).default;
                // Use correct page for pagination
                const page = (additional && typeof additional === 'object' && typeof (additional as { page?: number }).page === 'number')
                  ? (additional as { page: number }).page
                  : 1;
                let params: Record<string, string | number>;
                if (customerName && customerName.trim() !== '') {
                  // If customerName is selected, always filter by both q and customer_name
                  params = {
                    page: page,
                    page_size: 10,
                    q: inputValue || '',
                    customer_name: customerName
                  };
                } else {
                  // If customerName is not selected, filter only by q
                  params = {
                    page: page,
                    page_size: 10,
                    q: inputValue || '',
                  };
                }
                const res = await axios.get('http://localhost:8000/search/link-id', { params });
                const data = res.data;
                // If backend does not return has_more, fallback to results length
                const hasMore = typeof data.has_more !== 'undefined'
                  ? data.has_more
                  : (data.results && data.results.length === 10);
                return {
                  options: data.results || [],
                  hasMore,
                  additional: { page: page + 1 },
                };
              }}
              placeholder="Link ID"
              debounceTimeout={400}
            />
            <Button onClick={handleDashboardFilterApply} disabled={loading} className="text-white bg-[#164396] flex items-center justify-center min-w-20">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
            </Button>
            {(!!customerName || !!linkId || !!createFromDate || !!createEndDate ||
              (createFromTime && (createFromTime.getHours() !== 0 || createFromTime.getMinutes() !== 0 || createFromTime.getSeconds() !== 0)) ||
              (createEndTime && (createEndTime.getHours() !== 23 || createEndTime.getMinutes() !== 59 || createEndTime.getSeconds() !== 59))) && (
                <Button onClick={handleDashboardFilterReset} type="button" variant="outline" className="text-white border-white">
                  Reset
                </Button>
              )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        {/* Kiri - Enterprise */}
        <section className="space-y-4 rounded-lg shadow-md p-2 pt-0 bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396]">
          <div className="bg-[#164396] text-white text-xl font-semibold text-center w-1/2 py-2 rounded-b-2xl mb-3 mx-auto shadow-xl/30">
            <span>Enterprise</span>
          </div>
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
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.oos.total ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.oos.mttr_breakdown.below_1_hour ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.oos.mttr_breakdown.hour_1_to_4 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.oos.mttr_breakdown.hour_4_to_8 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.oos.mttr_breakdown.hour_8_to_24 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.oos.mttr_breakdown.above_24_hour ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
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
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.others.total ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.others.mttr_breakdown.below_1_hour ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.others.mttr_breakdown.hour_1_to_4 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.others.mttr_breakdown.hour_4_to_8 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.others.mttr_breakdown.hour_8_to_24 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.enterprise.others.mttr_breakdown.above_24_hour ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
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
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.oos.total ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.oos.mttr_breakdown.below_1_hour ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.oos.mttr_breakdown.hour_1_to_4 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.oos.mttr_breakdown.hour_4_to_8 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.oos.mttr_breakdown.hour_8_to_24 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.oos.mttr_breakdown.above_24_hour ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
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
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.others.total ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">Below 1 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.others.mttr_breakdown.below_1_hour ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">1-4 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.others.mttr_breakdown.hour_1_to_4 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1">
                    <div className="text-xs font-bold">4-8 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.others.mttr_breakdown.hour_4_to_8 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold">8-24 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.others.mttr_breakdown.hour_8_to_24 ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center space-y-1 text-center">
                    <div className="text-xs font-bold"> Above 24 Hour</div>
                    <div className="text-2xl font-bold flex items-center justify-center min-h-[2.25rem]">
                      {loading ? <Loader2 className="h-[2.25rem] w-[2.25rem] animate-spin text-white" /> : dashboardData?.partnership.others.mttr_breakdown.above_24_hour ?? 0}
                    </div>
                    <div className="text-xs">T  T</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Chart Filters */}
      {/* <section className="pt-4 px-0 space-y-4">
        <div className="flex flex-wrap  gap-4">

          <div className="space-y-2 min-w-[180px]">
            <Label htmlFor="link-type" className="text-sm font-medium text-white">
              Link Type
            </Label>
            <Select value={linkType} onValueChange={(value: 'enterprise' | 'wholesale' | 'all') => setLinkType(value)}>
              <SelectTrigger className="w-full min-w-[180px] bg-background">
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
            <Label htmlFor="chart-customer-name" className="text-sm font-medium text-white">
              Customer Name
            </Label>
            <AsyncPaginateSelect
              value={chartCustomerName ? { label: chartCustomerName, value: chartCustomerName } : null}
              onChange={(option) => setChartCustomerName(option ? option.value : '')}
              loadOptions={createLoadOptions<{ label: string; value: string }>('http://localhost:8000/search/customer-name')}
              placeholder="Customer Name"
              debounceTimeout={400}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-id" className="text-sm font-medium text-white">
              Link ID
            </Label>
            <div className='flex items-center gap-4 w-full'>
              <AsyncPaginateSelect
                key={chartCustomerName || 'no-customer'}
                value={chartLinkId ? { label: chartLinkId, value: chartLinkId } : null}
                onChange={(option) => setChartLinkId(option ? option.value : '')}
                loadOptions={async (inputValue, loadedOptions, additional) => {
                  const axios = (await import('axios')).default;
                  const page = (additional && typeof additional === 'object' && typeof (additional as { page?: number }).page === 'number')
                    ? (additional as { page: number }).page
                    : 1;
                  let params: Record<string, string | number>;
                  if (chartCustomerName && chartCustomerName.trim() !== '') {
                    params = {
                      page: page,
                      page_size: 10,
                      q: inputValue || '',
                      customer_name: chartCustomerName
                    };
                  } else {
                    params = {
                      page: page,
                      page_size: 10,
                      q: inputValue || '',
                    };
                  }
                  const res = await axios.get('http://localhost:8000/search/link-id', { params });
                  const data = res.data;
                  const hasMore = typeof data.has_more !== 'undefined'
                    ? data.has_more
                    : (data.results && data.results.length === 10);
                  return {
                    options: data.results || [],
                    hasMore,
                    additional: { page: page + 1 },
                  };
                }}
                placeholder="Link ID"
                debounceTimeout={400}
              />
              <Button onClick={handleChartFilterApply} disabled={chartFilterLoading} className="text-white bg-[#164396] flex items-center justify-center min-w-20">
                {chartFilterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
              </Button>
              {(linkType !== 'all' || !!chartCustomerName || !!chartLinkId) && (
                <Button onClick={handleChartFilterReset} type="button" variant="outline" className="text-white border-white">
                  Reset
                </Button>
              )}
            </div>
          </div>

        </div>

      </section> */}



      {/* Trends Section */}
      <ChartSection />
    </div >


  );
};

export default HomePage;