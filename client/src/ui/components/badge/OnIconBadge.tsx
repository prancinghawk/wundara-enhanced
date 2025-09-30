import {FC, MouseEventHandler, ReactNode} from "react";

import {cn} from "../../utils/utils";

export interface OnIconBadgeProps {
    children?: ReactNode;
    className?: string;
    count?: string | number;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

const OnIconBadge: FC<OnIconBadgeProps> = ({
    className,
    count,
    onClick,
    children,
}: OnIconBadgeProps) => {
    return (
        <div
            className={cn(`onIconBadge ${className || ""}`)}
            onClick={onClick}>
            {count || children}
        </div>
    );
};

export {OnIconBadge};
