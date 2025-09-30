import {ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode} from "react";

import {Icon} from "../../../elements";

import {cn} from "../../../utils/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    text?: string;
    variant?: "filled" | "tonal" | "outlined" | "elevated" | "text";
}

const Button: FC<ButtonProps> = ({
    children,
    className,
    disabled,
    iconLeft,
    iconRight,
    variant = "filled",
    onClick,
    text = "Button",
    ...props
}: ButtonProps) => {
    return (
        <button
            className={cn(`btn ${variant} ${className || ""}`)}
            disabled={disabled}
            onClick={onClick}
            {...props}>
            <Icon iconLeft={iconLeft} />
            {children || text}
            <Icon iconRight={iconRight} />
        </button>
    );
};

export {Button};
