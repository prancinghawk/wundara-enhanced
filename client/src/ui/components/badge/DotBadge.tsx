import {FC, MouseEventHandler} from "react";

import {cn} from "../../utils/utils";

export interface DotBadgeProps {
    className?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

const DotBadge: FC<DotBadgeProps> = ({className, onClick}: DotBadgeProps) => {
    return (
        <div
            className={cn(`dotBadge ${className || ""}`)}
            onClick={onClick}
        />
    );
};

export {DotBadge};
