import {FC, MouseEventHandler, ReactNode} from "react";

import {OnIconBadge} from "../index";

import {Icon} from "../../elements";

interface NavBarItemProps {
    badge?: boolean;
    badgeColor?: string;
    badgeText?: string;
    icon?: ReactNode;
    label?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const NavBarItem: FC<NavBarItemProps> = ({
    badge,
    badgeColor,
    badgeText,
    icon,
    label,
    onClick,
}: NavBarItemProps) => {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-[4px]">
            <div className="flex">
                <button
                    className="h-[32px] rounded-full px-[20px] hover:bg-surface-container-high focus:bg-surface-container-high"
                    onClick={onClick}>
                    <div className="relative h-[24px] w-[24px]">
                        <Icon icon={icon} />

                        {badge && (
                            <div className="absolute right-[2px] top-[2px] z-10 flex items-center justify-center">
                                <OnIconBadge
                                    className={badgeColor}
                                    count={badgeText}
                                />
                            </div>
                        )}
                    </div>
                </button>
                <span></span>
            </div>
            <span className="text-label-medium">{label}</span>
        </div>
    );
};

export {NavBarItem};
