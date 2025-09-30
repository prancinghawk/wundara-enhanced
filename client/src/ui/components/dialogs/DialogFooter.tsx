import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface DialogFooterProps {
    children?: ReactNode;
    className?: string;
}

const DialogFooter: FC<DialogFooterProps> = ({
    children,
    className,
}: DialogFooterProps) => {
    return (
        <div
            className={cn(
                `mb-[24px] mt-[8px] flex items-center justify-end gap-[8px] px-[24px] ${
                    className || ""
                }`
            )}>
            {children}
        </div>
    );
};

export {DialogFooter};
