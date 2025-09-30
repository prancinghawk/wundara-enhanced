import {FC, ReactNode} from "react";

interface TableBodyProps {
    children?: ReactNode;
}

const TableBody: FC<TableBodyProps> = ({children}: TableBodyProps) => {
    return <tbody className="text-body-medium">{children}</tbody>;
};

export {TableBody};
