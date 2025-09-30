import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface TooltipProps {
    bottomLeft?: boolean;
    bottomRight?: boolean;
    children?: ReactNode;
    text?: string;
    topLeft?: boolean;
    topRight?: boolean;
}

const Tooltip: FC<TooltipProps> = ({
    bottomLeft,
    bottomRight,
    children,
    text,
    topLeft,
    topRight,
}: TooltipProps) => {
    return (
        <div className="group relative flex w-fit cursor-pointer ">
            {children}
            <div
                className={cn(`pointer-events-none absolute 
          
          ${topRight && "-right-0 bottom-full"}
          ${topLeft && "-left-0 bottom-full"}
          ${bottomRight && "-right-0 top-full"}
          ${bottomLeft && "-left-0 top-full"}   
          
          z-40 my-1 max-w-[200px] rounded-[12px] bg-surface-container-highest p-[12px]  opacity-0 group-hover:opacity-100`)}>
                <div className="flex w-max max-w-[200px] text-body-small text-on-surface">
                    {text}
                </div>
            </div>
        </div>
    );
};

export {Tooltip};
