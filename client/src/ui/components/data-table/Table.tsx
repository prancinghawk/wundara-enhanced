import {FC, ReactNode} from "react";

import {TableBody} from "./TableBody";
import {TableCell} from "./TableCell";
import {TableHead} from "./TableHead";
import {TableHeaderCell} from "./TableHeaderCell";
import {TableRow} from "./TableRow";

import {cn} from "../../utils/utils";

interface TableProps {
    children?: ReactNode;
    className?: string;
}

interface TableComponent extends FC<TableProps> {
    Body: typeof TableBody;
    Cell: typeof TableCell;
    Head: typeof TableHead;
    HeaderCell: typeof TableHeaderCell;
    Row: typeof TableRow;
}

const Table: TableComponent = ({children, className}: TableProps) => {
    return (
        <div className="overflow-auto">
            <table
                className={cn(`w-full table-auto overflow-clip text-body-small text-on-surface 
        ${className || ""}`)}>
                {children}
            </table>
        </div>
    );
};

Table.Body = TableBody;
Table.Cell = TableCell;
Table.Head = TableHead;
Table.HeaderCell = TableHeaderCell;
Table.Row = TableRow;

export {Table};
