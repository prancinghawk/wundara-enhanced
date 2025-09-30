import React, {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface ListProps {
    body?: string;
    className?: string;
    headline?: string;
    label?: string;
    leftElement?: ReactNode;
    rightElement?: ReactNode;
    width?: string;
}

const List: FC<ListProps> = ({
    body,
    className,
    headline,
    label,
    leftElement,
    rightElement,
    width = "w-full",
}: ListProps) => {
    return (
        <div
            className={cn(
                `flex ${width} flex-row items-center py-[12px] text-on-surface ${
                    className || ""
                }`
            )}>
            <div
                className={`${
                    leftElement && "pr-[12px] text-on-surface-variant"
                }`}>
                {leftElement}
            </div>
            <div className="flex w-full flex-col gap-0">
                {label && (
                    <div className="text-label-medium text-on-surface-variant">
                        {label}
                    </div>
                )}
                {headline && <div className="text-body-large">{headline}</div>}
                {body && (
                    <div className="text-body-medium text-on-surface-variant">
                        {body}
                    </div>
                )}
            </div>
            <div className="pl-[16px] pr-[0px] text-on-surface-variant">
                {rightElement}
            </div>
        </div>
    );
};

export {List};
