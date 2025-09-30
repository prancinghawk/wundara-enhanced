import {FC, MouseEventHandler, ReactNode} from "react";

import {Icon} from "../../elements";
import {OnIconBadge} from "../index";

interface NavRailItemProps {
    badge?: boolean;
    badgeColor?: string;
    badgeText?: string;
    icon?: ReactNode;
    label?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const NavRailItem: FC<NavRailItemProps> = ({
    badge,
    badgeColor,
    badgeText,
    icon,
    label,
    onClick,
}: NavRailItemProps) => {
    return (
        <div className="flex w-full flex-col items-center justify-center">
            <div className="relative flex">
                <button
                    className={`
              ${label ? "h-[32px]" : "h-[56px]"}  
              rounded-full px-[16px] hover:bg-surface-container-highest focus:bg-surface-container-highest
            `}
                    onClick={onClick}>
                    <Icon icon={icon} />
                    {badge && (
                        <div
                            className={`${
                                label
                                    ? "absolute right-[6px] top-[-4px] flex h-[16px] w-[16px] justify-end"
                                    : "absolute right-[6px] top-[8px] flex h-[16px] w-[16px] justify-end"
                            } `}>
                            <OnIconBadge
                                className={badgeColor}
                                count={badgeText}
                            />
                        </div>
                    )}
                </button>
                <span></span>
            </div>
            <span
                className={`${
                    label && "pb-[6px] pt-[4px] text-label-medium"
                } `}>
                {label}
            </span>
        </div>
    );
};

export {NavRailItem};
