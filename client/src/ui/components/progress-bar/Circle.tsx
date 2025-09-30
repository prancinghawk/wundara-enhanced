import {FC} from "react";

import {cn} from "../../utils/utils";

interface CircleProps {
    color?: string;
    size?: number;
    value?: number;
    width?: number;
}

const Circle: FC<CircleProps> = ({
    color = "stroke-primary",
    size = 48,
    value = 0,
    width = 4,
}: CircleProps) => {
    const center = size / 2,
        radius = center - (width > width ? width : width),
        dashArray = 2 * Math.PI * radius,
        dashOffset = dashArray * ((100 - value) / 100);

    return (
        <div
            className="relative -rotate-90"
            style={{width: size, height: size}}>
            <svg
                className="flex h-full w-full"
                style={{width: size, height: size}}>
                <circle
                    className="fill-none stroke-surface-container-high"
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={width}
                />
                <circle
                    className={cn(
                        `transform fill-none ${color} transition-all duration-700`
                    )}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={width}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                />
            </svg>
        </div>
    );
};

export {Circle};
