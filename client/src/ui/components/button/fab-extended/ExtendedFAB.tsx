import {ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode} from "react";

import {Icon} from "../../../elements";

import {cn} from "../../utils/utils";

interface ExtendedFABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    className?: string;
    icon?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    text?: string;
    variant?: "surface" | "secondary" | "tertiary";
}

const ExtendedFAB: FC<ExtendedFABProps> = ({
    children,
    className,
    icon,
    onClick,
    text = "Extended FAB",
    variant = "surface",
    ...props
}: ExtendedFABProps) => {
    return (
        <button
            className={cn(`fabExtended ${variant} ${className || ""}`)}
            onClick={onClick}
            {...props}>
            <Icon icon={icon} />
            {children || text}
        </button>
    );
};

export {ExtendedFAB};
