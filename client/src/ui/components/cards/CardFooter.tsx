import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface CardFooterProps {
    children?: ReactNode;
    className?: string;
}

const CardFooter: FC<CardFooterProps> = ({
    children,
    className,
}: CardFooterProps) => {
    return (
        <div
            className={cn(
                `flex h-fit w-full flex-row gap-[12px] ${className || ""}`
            )}>
            {children}
        </div>
    );
};

export {CardFooter};
