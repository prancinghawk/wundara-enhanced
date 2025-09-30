import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface TableHeaderCellProps {
    children?: ReactNode;
    className?: string;
    data?: ReactNode;
}

const TableHeaderCell: FC<TableHeaderCellProps> = ({
    children,
    className,
    data,
}: TableHeaderCellProps) => {
    return (
        <th
            className={cn(
                `min-w-max overflow-hidden px-[16px] py-[12px] text-left font-medium ${
                    className || ""
                }`
            )}>
            <div className="flex h-full w-full min-w-max flex-wrap">
                {children || data}
            </div>
        </th>
    );
};

TableHeaderCell.propTypes = {};

export {TableHeaderCell};
