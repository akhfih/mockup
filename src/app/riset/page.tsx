
// Update the import path below if the file is located elsewhere, for example:
// Update the import path below if the file is located elsewhere, for example:
// import { optionBar, optionLine, optionPie } from '../../components/echart/options';
// Or use the correct relative path based on your project structure.
// import { optionBar, optionLine, optionPie } from '@/components/echart/data';
// Or use the correct relative path based on your project structure.
import type { EChartsOption } from 'echarts';
import MTTRChart from '@/components/chart/MTTRChart';
import { EChart } from '@/components/echart/EChart';


const optionBar: EChartsOption = {
    xAxis: {
        type: 'category' as const,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
        type: 'value' as const,
    },
    series: [
        {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar' as const,
        },
    ],
}

const optionLine: EChartsOption = {
    xAxis: {
        type: 'category' as const,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
        type: 'value' as const,
    },
    series: [
        {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line' as const,
            smooth: true,
        },
    ],
}

const optionPie: EChartsOption = {
    tooltip: {
        trigger: 'item' as const,
    },
    legend: {
        show: false,
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
}


const RisetPage = () => {
    return (
        // <div className="flex flex-col items-center justify-center h-screen">
        //     <h1 className="text-4xl font-bold mb-4">Riset Page</h1>
        //     <p className="text-lg">This is the Riset page content.</p>
        // </div>

        <div className="App">
            <div>
                <h2>Bar</h2>
                {/* <EChart option={optionBar} /> */}
                <MTTRChart />
            </div>

            <div>
                <h2>Line</h2>
                <EChart option={optionLine} />
            </div>

            <div>
                <h2>Pie</h2>
                <EChart option={optionPie} />
            </div>
        </div>
    );
}

export default RisetPage;