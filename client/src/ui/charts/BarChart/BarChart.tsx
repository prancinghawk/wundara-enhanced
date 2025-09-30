import React from "react";

import {
    Color,
    colorValues,
    setCategoryColors,
} from "../../charts/helpers/utils/setColor";
import {cn} from "../../utils/utils";
import {useTheme} from "next-themes";
import {
    Bar,
    CartesianGrid,
    BarChart as ReChartsBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface BarChartProps {
    categories: string[];
    colors?: Color[];
    data: any[];
    dataKey: string;
    height?: string;
    layout?: "vertical" | "horizontal";
    lineCount?: number;
    marginTop?: string;
    relative?: boolean;
    showAnimation?: boolean;
    showGradient?: boolean;
    showGridLines?: boolean;
    showTooltip?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    yAxisWidth?: number;
}

const BarChart = ({
    categories = [],
    colors = colorValues,
    data = [],
    dataKey,
    height,
    layout = "horizontal",
    lineCount = 8,
    marginTop = "mt-0",
    relative = false,
    showAnimation = true,
    showGridLines = true,
    showTooltip = true,
    showXAxis = true,
    showYAxis = true,
    yAxisWidth = 40,
}: BarChartProps) => {
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
                <ReChartsBarChart
                    data={data}
                    stackOffset={relative ? "expand" : "none"}
                    margin={{top: 12}}
                    layout={layout === "vertical" ? "vertical" : "horizontal"}>
                    {showGridLines ? (
                        <CartesianGrid
                            strokeDasharray="1 3"
                            stroke={"#64748B70"}
                            horizontal={layout !== "vertical"}
                            vertical={layout === "vertical"}
                        />
                    ) : null}

                    {layout !== "vertical" ? (
                        <XAxis
                            hide={!showXAxis}
                            dataKey={dataKey}
                            interval="preserveStartEnd"
                            style={{
                                fontSize: "12px",
                                fontWeight: "400",
                                marginTop: "12px",
                            }}
                            tick={{
                                fill: "#64748B",
                                transform: "translate(0, 4)",
                            }}
                            tickLine={false}
                            axisLine={false}
                        />
                    ) : (
                        <XAxis
                            hide={!showXAxis}
                            type="number"
                            style={{
                                fontSize: "12px",
                                fontWeight: "400",
                                marginTop: "12px",
                            }}
                            height={40}
                            tick={{
                                fill: "#64748B",
                                transform: "translate(0, 4)",
                            }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={6}
                        />
                    )}
                    {layout !== "vertical" ? (
                        <YAxis
                            width={yAxisWidth}
                            tickCount={lineCount}
                            hide={!showYAxis}
                            axisLine={false}
                            tickLine={false}
                            style={{
                                fontSize: "12px",
                                fontWeight: "400",
                            }}
                            tick={{
                                fill: "#64748B",
                                transform: "translate(-4, 0)",
                            }}
                        />
                    ) : (
                        <YAxis
                            width={yAxisWidth}
                            hide={!showYAxis}
                            dataKey={dataKey}
                            axisLine={false}
                            tickLine={false}
                            type="category"
                            interval="preserveStartEnd"
                            style={{
                                fontSize: "12px",
                                fontWeight: "400",
                            }}
                            tick={{
                                fill: "#64748B",
                                transform: "translate(-4, 0)",
                            }}
                        />
                    )}
                    {showTooltip && (
                        <Tooltip
                            cursor={{fill: "#64748B10"}}
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
                                boxShadow: "0 8px 30px rgb(0,0,0,0.12)",
                            }}
                            labelStyle={{
                                fontSize: "16px",
                                fontWeight: "400",
                                color: text,
                            }}
                        />
                    )}

                    {categories.map((category) => (
                        <Bar
                            key={category}
                            name={category}
                            type="linear"
                            dataKey={category}
                            fill={categoryColors.get(category)}
                            isAnimationActive={showAnimation}
                            radius={
                                layout !== "vertical"
                                    ? [4, 4, 0, 0]
                                    : [0, 2, 2, 0]
                            }
                        />
                    ))}
                </ReChartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export {BarChart};
