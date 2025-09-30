import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface DialogBodyProps {
    children?: ReactNode;
    className?: string;
}

const DialogBody: FC<DialogBodyProps> = ({
    children,
    className,
}: DialogBodyProps) => {
    return (
        <div className={cn(`flex w-full px-[24px] ${className || ""}`)}>
            {children}
        </div>
    );
};

export {DialogBody};
