import {FC, ReactNode} from "react";

interface TableRowProps {
    children?: ReactNode;
}

const TableRow: FC<TableRowProps> = ({children}: TableRowProps) => {
    return (
        <tr className="overflow-hidden odd:bg-surface-container/50">
            {children}
        </tr>
    );
};

export {TableRow};
