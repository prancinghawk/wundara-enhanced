import {FC, ReactNode} from "react";

import {NavRailItem} from "./NavRailItem";

import {cn} from "../../utils/utils";

interface NavigationRailProps {
    height?: string;
    top?: ReactNode;
    center?: ReactNode;
    bottom?: ReactNode;
}

interface NavigationRailComponent extends FC<NavigationRailProps> {
    Item: typeof NavRailItem;
}

const NavigationRail: NavigationRailComponent = ({
    height,
    top,
    center,
    bottom,
}: NavigationRailProps) => {
    return (
        <div
            className={cn(
                `flex ${
                    height || "h-screen"
                } w-[80px] flex-col justify-start gap-[12px] rounded-extra-large bg-surface-container py-[16px] text-on-surface`
            )}>
            <div className="flex flex-col items-center justify-start gap-[12px]">
                {top}
            </div>
            <div className="flex h-full flex-col items-center justify-start gap-[8px] py-[16px]">
                {center}
            </div>
            <div className="flex flex-col items-center justify-end gap-[8px]">
                {bottom}
            </div>
        </div>
    );
};

NavigationRail.Item = NavRailItem;

export {NavigationRail};
