import React, {FC} from "react";

import {cn} from "../../utils/utils";

interface ProgressProps {
    color?: string;
    determinate?: boolean;
    duration?: number;
    indeterminate?: boolean;
    percentageValue?: number;
}

const Progress: FC<ProgressProps> = ({
    color = "bg-primary",
    determinate,
    duration,
    indeterminate,
    percentageValue,
}: ProgressProps) => {
    return (
        <div className="flex h-[4px] w-full overflow-hidden bg-surface-container-high">
            <div
                className={`h-full 
        ${percentageValue || "animate-determinate"} 
        ${color || ""}`}
                style={{
                    width: `${percentageValue || 0}%`,
                    transition:
                        percentageValue && duration
                            ? `all ${duration}ms`
                            : undefined,
                }}
            />

            {determinate && (
                <div
                    className={cn(`h-full animate-determinate transition-all 
          ${percentageValue || "w-full"}
          ${color}`)}
                />
            )}

            {indeterminate && (
                <div
                    className={cn(`h-full w-full animate-indeterminate transition-all
          ${color}`)}
                />
            )}
        </div>
    );
};

export {Progress};
