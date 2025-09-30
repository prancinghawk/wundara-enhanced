import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface BottomAppBarProps {
    className?: string;
    children: ReactNode;
    bg?: string;
    fab: ReactNode;
    width?: string;
}

const BottomAppBar: FC<BottomAppBarProps> = ({
    className,
    children,
    bg,
    fab,
    width,
}: BottomAppBarProps) => {
    return (
        <div
            className={cn(`flex h-[80px] flex-row p-[12px] text-on-surface
      ${width || "w-full"}
      ${bg || "bg-surface-container"}
      ${className || ""}
       `)}>
            <div className="flex w-full flex-row items-center gap-[8px] pl-[8px]">
                {children}
            </div>
            <div className="flex flex-row items-center justify-end">{fab}</div>
        </div>
    );
};

export {BottomAppBar};
