import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface CardBodyProps {
    children?: ReactNode;
    className?: string;
    height?: string;
}

const CardBody: FC<CardBodyProps> = ({
    children,
    className,
    height,
}: CardBodyProps) => {
    return (
        <div
            className={cn(`flex w-full flex-col gap-[12px]  
      ${height || "h-fit"}
      ${className || ""}
      `)}>
            {children}
        </div>
    );
};

export {CardBody};
