import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface CardHeaderProps {
    children?: ReactNode;
    className?: string;
}

const CardHeader: FC<CardHeaderProps> = ({
    children,
    className,
}: CardHeaderProps) => {
    return (
        <div className={cn(`flex flex-row ${className || ""}`)}>{children}</div>
    );
};

export {CardHeader};
