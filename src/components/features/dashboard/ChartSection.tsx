import { Label } from '@radix-ui/react-label';
import { EChartsOption } from 'echarts';
import { LucideLoader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DateTimePicker } from '@/components/datetime-picker/datetime-picker';
// import { SimpleTimePicker } from '@/components/datetime-picker/simple-time-picker';
import { EChart } from '@/components/echart/EChart';
import { AsyncPaginateSelect } from '@/components/ui/AsyncPaginateSelect';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createLoadOptions } from '@/lib/asyncPaginateHelpers';
import { ChartFilters, ChartResponse, dashboardService } from '@/services/dashboardService';


const ChartSection: React.FC = () => {
    const [dailyChartData, setDailyChartData] = useState<ChartResponse | null>(null);
    const [dailyChartLoading, setDailyChartLoading] = useState(false);
    const [weeklyChartData, setWeeklyChartData] = useState<ChartResponse | null>(null);
    const [linkType, setLinkType] = useState<'enterprise' | 'wholesale' | 'all'>('all');
    const [chartCustomerName, setChartCustomerName] = useState('');
    const [chartLinkId, setChartLinkId] = useState('');
    const [chartFilterLoading, setChartFilterLoading] = useState(false);
    const [weeklyChartLoading, setWeeklyChartLoading] = useState(false);
    const [yearlyChartData, setYearlyChartData] = useState<ChartResponse | null>(null);
    const [yearlyChartLoading, setYearlyChartLoading] = useState(false);
    const [createFromDate, setCreateFromDate] = useState<Date | undefined>(undefined);
    // const [createFromTime, setCreateFromTime] = useState<Date | undefined>(() => {
    //     const now = new Date();
    //     now.setHours(23, 59, 59, 59);
    //     return now;
    // });
    // Generate ECharts option for yearly chart (similar style)
    const generateChartYearlyOption = (data: ChartResponse): EChartsOption => {
        const legendData = data && data.series && data.series.length > 0
            ? data.series.map(s => s.name)
            : ["Data"];
        return {
            title: {
                text: data.title,
                left: 'center',
                textStyle: {
                    rich: {
                        a: { fontSize: 16, fontWeight: 'bold', color: '#333', lineHeight: 30 },
                        b: { fontSize: 14, color: '#666', lineHeight: 26 }
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: unknown) => {
                    type TooltipParam = {
                        axisValueLabel?: string;
                        axisValue?: string;
                        value: number;
                        color: string;
                        seriesName: string;
                    };
                    const paramArray: TooltipParam[] = Array.isArray(params) ? params as TooltipParam[] : [params as TooltipParam];
                    const label = paramArray[0]?.axisValueLabel || paramArray[0]?.axisValue || '';
                    const lines = [`${label}`];
                    for (const p of paramArray) {
                        const seconds = typeof p.value === 'number' ? p.value : 0;
                        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
                        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                        const s = (seconds % 60).toString().padStart(2, '0');
                        lines.push(
                            `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background:${p.color};"></span> ${p.seriesName}: ${h}:${m}:${s}`
                        );
                    }
                    return lines.join('<br/>');
                }
            },
            toolbox: {
                show: true,
                feature: { saveAsImage: {} }
            },
            legend: {
                show: true,
                bottom: 0,
                type: 'scroll',
                data: legendData,
            },
            grid: {
                top: '20%', left: '3%', right: '4%', bottom: '15%', containLabel: true,
            },
            xAxis: {
                type: 'category', boundaryGap: true, data: data.x_axis_labels,
                axisLabel: { rotate: 18, interval: 0, fontSize: 9, },
            },
            yAxis: {
                type: 'value', name: 'Hour  ',
                axisLabel: {
                    formatter: (val) => {
                        const h = Math.floor(val / 3600);
                        return `${h}`;
                    },
                }
            },
            series: (data.series && data.series.length > 0)
                ? data.series.map(series => ({
                    name: series.name,
                    type: 'line',
                    data: series.data.map(item => {
                        const [hh, mm, ss] = (item.value || "00:00:00").split(':').map(Number);
                        return (hh * 3600) + (mm * 60) + ss;
                    }),
                    color: series.color,
                    smooth: false,
                    label: {
                        show: true,
                        fontSize: "9px",
                        formatter: (params) => {
                            const value = typeof params.value === 'number' ? params.value : Number(params.value) || 0;
                            const h = Math.floor(value / 3600).toString().padStart(2, '0');
                            const m = Math.floor((value % 3600) / 60).toString().padStart(2, '0');
                            const s = (value % 60).toString().padStart(2, '0');
                            return `${h}:${m}:${s}`;
                        }
                    },
                }))
                : [{ name: 'Data', type: 'line', data: [], color: '#888', smooth: false }]
        };
    };

    const fetchYearlyChartData = async (filters: ChartFilters) => {
        try {
            setYearlyChartLoading(true);
            const data = await dashboardService.getChartData(filters);
            setYearlyChartData(data);
        } catch (err) {
            console.error('Yearly chart data fetch error:', err);
        } finally {
            setYearlyChartLoading(false);
        }
    };

    const handleChartFilterReset = () => {
        setLinkType('all');
        setCreateFromDate(undefined);
        setChartCustomerName('');
        setChartLinkId('');
        // Langsung apply filter default chart
        fetchDailyChartData({
            chart_type: 'daily',
            link_type: 'all',
            days_back: [1, 2]
        });
        fetchWeeklyChartData({
            chart_type: 'weekly',
            link_type: 'all',
            weeks_back: [1, 2, 3, 4]
        });
        setTimeout(() => {
            // Ambil 3 tahun terakhir dari current date (atau tahun sekarang jika undefined)
            const now = createFromDate ? createFromDate : new Date();
            const currentYear = now.getFullYear();
            const last3Years = [currentYear - 2, currentYear - 1, currentYear];
            fetchYearlyChartData({
                chart_type: 'yearly',
                link_type: 'all',
                years: last3Years
            });
        }, 0);
        // Generate ECharts option for yearly chart (similar style)
        // const generateChartYearlyOption = (data: ChartResponse): EChartsOption => {
        //     const legendData = data && data.series && data.series.length > 0
        //         ? data.series.map(s => s.name)
        //         : ["Data"];
        //     return {
        //         title: {
        //             text: data.title,
        //             left: 'center',
        //             textStyle: {
        //                 rich: {
        //                     a: { fontSize: 16, fontWeight: 'bold', color: '#333', lineHeight: 30 },
        //                     b: { fontSize: 14, color: '#666', lineHeight: 26 }
        //                 }
        //             }
        //         },
        //         tooltip: {
        //             trigger: 'axis',
        //             formatter: (params: unknown) => {
        //                 type TooltipParam = {
        //                     axisValueLabel?: string;
        //                     axisValue?: string;
        //                     value: number;
        //                     color: string;
        //                     seriesName: string;
        //                 };
        //                 const paramArray: TooltipParam[] = Array.isArray(params) ? params as TooltipParam[] : [params as TooltipParam];
        //                 const label = paramArray[0]?.axisValueLabel || paramArray[0]?.axisValue || '';
        //                 const lines = [`${label}`];
        //                 for (const p of paramArray) {
        //                     const seconds = typeof p.value === 'number' ? p.value : 0;
        //                     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        //                     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        //                     const s = (seconds % 60).toString().padStart(2, '0');
        //                     lines.push(
        //                         `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background:${p.color};"></span> ${p.seriesName}: ${h}:${m}:${s}`
        //                     );
        //                 }
        //                 return lines.join('<br/>');
        //             }
        //         },
        //         toolbox: {
        //             show: true,
        //             feature: { saveAsImage: {} }
        //         },
        //         legend: {
        //             show: true,
        //             bottom: 0,
        //             type: 'scroll',
        //             data: legendData,
        //         },
        //         grid: {
        //             top: '20%', left: '3%', right: '4%', bottom: '15%', containLabel: true,
        //         },
        //         xAxis: {
        //             type: 'category', boundaryGap: true, data: data.x_axis_labels,
        //             axisLabel: { rotate: 18, interval: 0, fontSize: 9, },
        //         },
        //         yAxis: {
        //             type: 'value', name: 'Hour  ',
        //             axisLabel: {
        //                 formatter: (val) => {
        //                     const h = Math.floor(val / 3600);
        //                     return `${h}`;
        //                 },
        //             }
        //         },
        //         series: (data.series && data.series.length > 0)
        //             ? data.series.map(series => ({
        //                 name: series.name,
        //                 type: 'line',
        //                 data: series.data.map(item => {
        //                     const [hh, mm, ss] = (item.value || "00:00:00").split(':').map(Number);
        //                     return (hh * 3600) + (mm * 60) + ss;
        //                 }),
        //                 color: series.color,
        //                 smooth: false,
        //                 label: {
        //                     show: true,
        //                     fontSize: "9px",
        //                     formatter: (params) => {
        //                         const value = typeof params.value === 'number' ? params.value : Number(params.value) || 0;
        //                         const h = Math.floor(value / 3600).toString().padStart(2, '0');
        //                         const m = Math.floor((value % 3600) / 60).toString().padStart(2, '0');
        //                         const s = (value % 60).toString().padStart(2, '0');
        //                         return `${h}:${m}:${s}`;
        //                     }
        //                 },
        //             }))
        //             : [{ name: 'Data', type: 'line', data: [], color: '#888', smooth: false }]
        //     };
        // };
        const fetchYearlyChartData = async (filters: ChartFilters) => {
            try {
                setYearlyChartLoading(true);
                const data = await dashboardService.getChartData(filters);
                setYearlyChartData(data);
            } catch (err) {
                console.error('Yearly chart data fetch error:', err);
            } finally {
                setYearlyChartLoading(false);
            }
        };
    };
    // Generate ECharts option from API data (styled like TTTrendChart)
    const generateCharDailytOption = (data: ChartResponse): EChartsOption => {
        // Always show legend, even if data is empty
        const legendData = data && data.series && data.series.length > 0
            ? data.series.map(s => s.name)
            : ["Data"];

        // const seriesData = data.series[0].data.map(item => {
        //     // Konversi value hh:mm:ss menjadi total detik
        //     const [hh, mm, ss] = item.value.split(':').map(Number);
        //     return (hh * 3600) + (mm * 60) + ss;
        // });

        // console.log("seriesData", seriesData);
        return {
            // backgroundColor: '#1f1f1f',
            title: {
                text: data.title, // isi dari Python tadi
                left: 'center',

                textStyle: {
                    rich: {
                        a: {
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#333',
                            lineHeight: 30
                        },
                        b: {
                            fontSize: 14,
                            color: '#666',
                            lineHeight: 26
                        }
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                // Show all compared series in tooltip
                formatter: (params: unknown) => {
                    type TooltipParam = {
                        axisValueLabel?: string;
                        axisValue?: string;
                        value: number;
                        color: string;
                        seriesName: string;
                    };
                    const paramArray: TooltipParam[] = Array.isArray(params) ? params as TooltipParam[] : [params as TooltipParam];
                    const label = paramArray[0]?.axisValueLabel || paramArray[0]?.axisValue || '';
                    const lines = [`${label}`];
                    for (const p of paramArray) {
                        const seconds = typeof p.value === 'number' ? p.value : 0;
                        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
                        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                        const s = (seconds % 60).toString().padStart(2, '0');
                        lines.push(
                            `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background:${p.color};"></span> ${p.seriesName}: ${h}:${m}:${s}`
                        );
                    }
                    return lines.join('<br/>');
                }
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                show: true,
                bottom: 0,
                type: 'scroll',
                data: legendData,
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: data.x_axis_labels,
                axisLabel: { rotate: 70, interval: 0, fontSize: 9, },
            },
            yAxis: {
                type: 'value',
                name: 'Hour  ',
                axisLabel: {
                    formatter: (val) => {
                        // Tampilkan sebagai "X jam Y menit"
                        const h = Math.floor(val / 3600);

                        return `${h}`
                    },

                }
            },
            series: (data.series && data.series.length > 0)
                ? data.series.map(series => ({
                    name: series.name,
                    type: 'line',
                    data: series.data.map(item => {
                        const [hh, mm, ss] = (item.value || item.value || "00:00:00").split(':').map(Number);
                        return (hh * 3600) + (mm * 60) + ss;
                    }),
                    label: {
                        show: true,
                        fontSize: "9px",    // Tampilkan label
                        // Posisi label di atas titik
                        formatter: (params) => {
                            // ECharts passes value as params.value, which can be number or string
                            const value = typeof params.value === 'number' ? params.value : Number(params.value) || 0;
                            const h = Math.floor(value / 3600).toString().padStart(2, '0');
                            const m = Math.floor((value % 3600) / 60).toString().padStart(2, '0');
                            const s = (value % 60).toString().padStart(2, '0');
                            return `${h}:${m}:${s}`;
                        }
                    },
                    color: series.color,
                    smooth: false,
                }))
                : [{
                    name: 'Data',
                    type: 'line',
                    data: [],
                    color: '#888',
                    smooth: false,
                }]
        };
    };

    const generateCharWeeklytOption = (data: ChartResponse): EChartsOption => {
        // Always show legend, even if data is empty
        const legendData = data && data.series && data.series.length > 0
            ? data.series.map(s => s.name)
            : ["Data"];

        // const seriesData = data.series[0].data.map(item => {
        //     // Konversi value hh:mm:ss menjadi total detik
        //     const [hh, mm, ss] = item.value.split(':').map(Number);
        //     return (hh * 3600) + (mm * 60) + ss;
        // });

        // console.log("seriesData", data);
        return {
            // backgroundColor: '#1f1f1f',
            title: {
                text: data.title, // isi dari Python tadi
                left: 'center',

                textStyle: {
                    rich: {
                        a: {
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#333',
                            lineHeight: 30
                        },
                        b: {
                            fontSize: 14,
                            color: '#666',
                            lineHeight: 26
                        }
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                // Show all compared series in tooltip
                formatter: (params: unknown) => {
                    type TooltipParam = {
                        axisValueLabel?: string;
                        axisValue?: string;
                        value: number;
                        color: string;
                        seriesName: string;
                    };
                    const paramArray: TooltipParam[] = Array.isArray(params) ? params as TooltipParam[] : [params as TooltipParam];
                    const label = paramArray[0]?.axisValueLabel || paramArray[0]?.axisValue || '';
                    const lines = [`${label}`];
                    for (const p of paramArray) {
                        const seconds = typeof p.value === 'number' ? p.value : 0;
                        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
                        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                        const s = (seconds % 60).toString().padStart(2, '0');
                        lines.push(
                            `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background:${p.color};"></span> ${p.seriesName}: ${h}:${m}:${s}`
                        );
                    }
                    return lines.join('<br/>');
                }
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                show: true,
                bottom: 0,
                type: 'scroll',
                data: legendData,
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: data.x_axis_labels,
                axisLabel: { rotate: 18, interval: 0, fontSize: 9, },
            },
            yAxis: {
                type: 'value',
                name: 'Hour  ',
                axisLabel: {
                    formatter: (val) => {
                        // Tampilkan sebagai "X jam Y menit"
                        const h = Math.floor(val / 3600);

                        return `${h}`
                    },

                }
            },
            series: (data.series && data.series.length > 0)
                ? data.series.map(series => ({
                    name: series.name,
                    type: 'line',
                    data: series.data.map(item => {
                        const [hh, mm, ss] = (item.value || item.value || "00:00:00").split(':').map(Number);
                        return (hh * 3600) + (mm * 60) + ss;
                    }),
                    color: series.color,
                    smooth: false,
                    label: {
                        show: true,
                        fontSize: "9px",    // Tampilkan label
                        // Posisi label di atas titik
                        formatter: (params) => {
                            // ECharts passes value as params.value, which can be number or string
                            const value = typeof params.value === 'number' ? params.value : Number(params.value) || 0;
                            const h = Math.floor(value / 3600).toString().padStart(2, '0');
                            const m = Math.floor((value % 3600) / 60).toString().padStart(2, '0');
                            const s = (value % 60).toString().padStart(2, '0');
                            return `${h}:${m}:${s}`;
                        }
                    },
                }))
                : [{
                    name: 'Data',
                    type: 'line',
                    data: [],
                    color: '#888',
                    smooth: false,
                }]
        };
    };

    const fetchDailyChartData = async (filters: ChartFilters) => {
        try {
            setDailyChartLoading(true);
            // console.log("Sending daily chart filters:", JSON.stringify(filters, null, 2));
            const data = await dashboardService.getChartData(filters);
            // console.log("Received daily chart data:", JSON.stringify(data, null, 2));
            setDailyChartData(data);
        } catch (err) {
            console.error('Daily chart data fetch error:', err);
        } finally {
            setDailyChartLoading(false);
        }
    };

    const fetchWeeklyChartData = async (filters: ChartFilters) => {
        try {
            setWeeklyChartLoading(true);
            const data = await dashboardService.getChartData(filters);

            setWeeklyChartData(data);
        } catch (err) {
            console.error('Weekly chart data fetch error:', err);
        } finally {
            setWeeklyChartLoading(false);
        }
    };

    useEffect(() => {
        const filtersDaily: ChartFilters = {
            chart_type: 'daily',
            days_back: [1, 2, 3, 4, 5],
            current_date: createFromDate ? createFromDate.toISOString().slice(0, 10) : undefined
        };
        fetchDailyChartData(filtersDaily);

        const filtersWeekly: ChartFilters = {
            chart_type: 'weekly',
            weeks_back: [1, 2, 3, 4, 5],
            current_date: createFromDate ? createFromDate.toISOString().slice(0, 10) : undefined
        };
        fetchWeeklyChartData(filtersWeekly);

        const now = createFromDate ? createFromDate : new Date();
        const currentYear = now.getFullYear();
        const filtersYearly: ChartFilters = {
            chart_type: 'yearly',
            years: [currentYear - 2, currentYear - 1, currentYear],
            current_date: createFromDate ? createFromDate.toISOString().slice(0, 10) : undefined
        };
        fetchYearlyChartData(filtersYearly);
    }, [createFromDate]);

    useEffect(() => {
        console.log("weekly" + weeklyChartData)

    }, [weeklyChartData]);

    const handleChartFilterApply = async () => {
        setChartFilterLoading(true);
        const baseFilters = {
            link_type: linkType,
            ...(chartCustomerName && { customer_name: chartCustomerName }),
            ...(chartLinkId && { link_id: chartLinkId }),
            ...(createFromDate ? { current_date: createFromDate.toISOString().slice(0, 10) } : {}),
        };

        console.log("date", createFromDate ? createFromDate.toISOString().slice(0, 10) : "undefined");
        try {
            const now = createFromDate ? createFromDate : new Date();
            const currentYear = now.getFullYear();
            const last3Years = [currentYear - 2, currentYear - 1, currentYear];

            await Promise.all([
                fetchDailyChartData({
                    ...baseFilters,
                    chart_type: 'daily',
                    days_back: [1, 2],
                }),
                fetchWeeklyChartData({
                    ...baseFilters,
                    chart_type: 'weekly',
                    weeks_back: [1, 2, 3, 4],
                }),
                fetchYearlyChartData({
                    ...baseFilters,
                    chart_type: 'yearly',
                    years: last3Years,
                })
            ]);
        } finally {
            setChartFilterLoading(false);
        }
    };

    return (
        <>
            <section className="pt-4 px-0 space-y-4">

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
                        <Label htmlFor="link-type" className="text-sm font-medium text-white">
                            Set Current Date
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
                            {/* <SimpleTimePicker
                                value={createFromTime ?? new Date()}
                                onChange={setCreateFromTime}
                            /> */}
                        </div>
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
                                {chartFilterLoading ? <LucideLoader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                            </Button>
                            {(linkType !== 'all' || !!chartCustomerName || !!chartLinkId) && (
                                <Button onClick={handleChartFilterReset} type="button" variant="outline" className="text-white border-white">
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>

                </div>

            </section >

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Daily Chart */}
                <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-3 pt-0 mb-3 space-y-3 text-white">
                    <h4 className="bg-[#164396] text-white text-xl font-semibold text-center w-1/2 py-2 rounded-b-2xl mb-3 mx-auto shadow-xl/30">Daily Trend</h4>
                    <div className="bg-gray-100 bg-opacity-30 rounded-xs p-4">
                        {dailyChartData ? (
                            <div style={{ height: '100%' }}>
                                <EChart option={generateCharDailytOption(dailyChartData)} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                {dailyChartLoading ? (
                                    <LucideLoader2 className="h-8 w-8 animate-spin text-white" />
                                ) : (
                                    <div className="text-white">No daily data available</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Weekly Chart */}
                <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-3 pt-0 mb-3 space-y-3 text-white">
                    <h4 className="bg-[#164396] text-white text-xl font-semibold text-center w-1/2 py-2 rounded-b-2xl mb-3 mx-auto shadow-xl/30">Weekly Trend</h4>
                    <div className="bg-gray-100 bg-opacity-30 rounded-xs p-4">
                        {weeklyChartData ? (
                            <div style={{ height: '100%' }}>
                                <EChart option={generateCharWeeklytOption(weeklyChartData)} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                {weeklyChartLoading ? (
                                    <LucideLoader2 className="h-8 w-8 animate-spin text-white" />
                                ) : (
                                    <div className="text-white">No weekly data available</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Yearly Chart */}
                <div className="bg-gradient-to-br from-[#1a1939] to-[#806720] border border-[#164396] rounded-lg p-3 pt-0 mb-3 space-y-3 text-white">
                    <h4 className="bg-[#164396] text-white text-xl font-semibold text-center w-1/2 py-2 rounded-b-2xl mb-3 mx-auto shadow-xl/30">Yearly Trend</h4>
                    <div className="bg-gray-100 bg-opacity-30 rounded-xs p-4">
                        {yearlyChartData ? (
                            <div style={{ height: '100%' }}>
                                <EChart option={generateChartYearlyOption(yearlyChartData)} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                {yearlyChartLoading ? (
                                    <LucideLoader2 className="h-8 w-8 animate-spin text-white" />
                                ) : (
                                    <div className="text-white">No yearly data available</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>


    );
};

export default ChartSection;