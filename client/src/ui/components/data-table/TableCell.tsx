import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface TableCellProps {
    data?: ReactNode;
    children?: ReactNode;
    className?: string;
}

const TableCell: FC<TableCellProps> = ({
    data,
    children,
    className,
}: TableCellProps) => {
    return (
        <td
            className={cn(
                `min-w-max px-[16px] py-[12px] pr-[32px] ${className || ""}`
            )}>
            <span className="flex sm:min-w-max">{children || data}</span>
        </td>
    );
};

export {TableCell};
