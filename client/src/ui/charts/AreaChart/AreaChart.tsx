import {Color, colorValues, setCategoryColors} from "../helpers/utils/setColor";

import {cn} from "../../utils/utils";
import {useTheme} from "next-themes";
import {
    Area,
    CartesianGrid,
    AreaChart as RechartsAreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type CurveType = "basis" | "linear" | "natural" | "monotone" | "step";

interface AreaChartProps {
    categories: string[];
    colors?: Color[];
    strokeColor?: string;
    data: any[];
    dataKey: string;
    height?: string;
    lineCount?: number;
    marginTop?: string;
    showAnimation?: boolean;
    showGradient?: boolean;
    showGridLines?: boolean;
    showTooltip?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    type?: CurveType;
}

const AreaChart = ({
    categories = [],
    colors = colorValues,
    data = [],
    dataKey,
    height,
    lineCount = 8,
    marginTop = "mt-0",
    showAnimation = true,
    showGradient,
    showGridLines = true,
    showTooltip = true,
    showXAxis = true,
    showYAxis = true,
    type = "monotone",
}: AreaChartProps) => {
    const categoryColors = setCategoryColors(categories, colors);
    const {resolvedTheme} = useTheme();
    let bg;
    let text;

    //Tooltip theme
    switch (resolvedTheme) {
        case "light":
            bg = "#EEF2FF";
            text = "#000000";
            break;
        case "dark":
            bg = "#111827";
            text = "#ffffff";
            break;
    }

    return (
        <div
            className={cn(`flex w-full ${height || "h-[300px]"} ${marginTop}`)}>
            <ResponsiveContainer
                width="100%"
                height="100%">
                <RechartsAreaChart
                    data={data}
                    margin={{top: 12}}>
                    {showGridLines && (
                        <CartesianGrid
                            strokeDasharray="1 3"
                            stroke={"#64748B70"}
                            horizontal={true}
                            vertical={false}
                        />
                    )}

                    {showTooltip && (
                        <Tooltip
                            cursor={false}
                            wrapperStyle={{
                                outline: "none",
                            }}
                            contentStyle={{
                                background: bg,
                                backdropFilter: "blur(8px)",
                                borderRadius: 12,
                                outline: "none",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: "400",
                                padding: "16px",
                                boxShadow: "0 8px 30px rgb(0,0,0,0.12)",
                            }}
                            labelStyle={{
                                fontSize: "16px",
                                fontWeight: "400",
                                color: text,
                            }}
                        />
                    )}

                    <XAxis
                        hide={!showXAxis}
                        dataKey={dataKey}
                        tick={{fill: "#64748B", transform: "translate(0, 4)"}}
                        style={{
                            fontSize: "12px",
                            fontWeight: "400",
                            marginTop: "12px",
                        }}
                        tickLine={false}
                        padding={{left: 12, right: 12}}
                        axisLine={false}
                        minTickGap={0}
                        interval="preserveStartEnd"
                    />

                    <YAxis
                        hide={!showYAxis}
                        axisLine={false}
                        tickLine={false}
                        tickCount={lineCount}
                        type="number"
                        tick={{fill: "#64748B", transform: "translate(-8, 0)"}}
                        style={{
                            fontSize: "12px",
                            fontWeight: "400",
                        }}
                    />

                    {categories.map((category) => (
                        <defs key={category}>
                            {showGradient ? (
                                <linearGradient
                                    id={category}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1">
                                    <stop
                                        offset="0%"
                                        stopColor={`${categoryColors.get(
                                            category
                                        )}`}
                                        stopOpacity={0.5}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={`${categoryColors.get(
                                            category
                                        )}`}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            ) : (
                                <linearGradient
                                    id={`${categoryColors.get(category)}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1">
                                    <stop
                                        stopColor={""}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            )}
                        </defs>
                    ))}

                    {categories.map((category) => (
                        <Area
                            key={category}
                            name={category}
                            type={type}
                            dataKey={category}
                            stroke={`${categoryColors.get(category)}`}
                            fill={`url(#${category})`}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={showAnimation}
                        />
                    ))}
                </RechartsAreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export {AreaChart};
