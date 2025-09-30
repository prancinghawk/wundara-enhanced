import {FC, MouseEventHandler, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface ChipsProps {
    children?: ReactNode;
    className?: string;
    text?: string;
    leftElement?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    rightElement?: ReactNode;
}

const Chips: FC<ChipsProps> = ({
    children,
    className,
    text = "Chips",
    leftElement,
    onClick,
    rightElement,
}: ChipsProps) => {
    return (
        <button
            className={cn(`chips ${className || ""}`)}
            onClick={onClick}>
            {leftElement && <div>{leftElement}</div>}
            {children || text}
            {rightElement && <div>{rightElement}</div>}
        </button>
    );
};

export {Chips};
