import {FC, MouseEventHandler, ReactNode} from "react";

import {Badge} from "../badge/Badge";

interface OverflowMenuItemProps {
    badge?: boolean;
    badgeText?: string;
    children?: ReactNode;
    id?: string;
    label?: string;
    leftElement?: ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement>;
    rightElement?: ReactNode;
}

const OverflowMenuItem: FC<OverflowMenuItemProps> = ({
    badge,
    badgeText,
    children,
    id,
    label,
    leftElement,
    onClick,
    rightElement,
}: OverflowMenuItemProps) => {
    return (
        <div
            onClick={onClick}
            className="flex min-w-max"
            key={id}>
            <div className="flex h-[48px] w-full min-w-[112px] cursor-pointer flex-row items-center justify-between pl-[12px] pr-[24px] text-label-large text-on-surface hover:bg-surface-container-highest">
                <div
                    className={`${
                        leftElement && "pr-[12px] text-on-surface-variant"
                    }`}>
                    {leftElement}
                </div>
                <p className="flex w-full min-w-max text-left">
                    {label || children}
                </p>
                {rightElement && (
                    <div
                        className={`flex pl-[28px] text-body-small text-on-surface-variant`}>
                        {rightElement}
                    </div>
                )}
                {badge && (
                    <div
                        className={`${
                            badge && "pl-[28px] text-on-surface-variant"
                        }`}>
                        <Badge text={badgeText || "New"} />
                    </div>
                )}
            </div>
        </div>
    );
};

export {OverflowMenuItem};
