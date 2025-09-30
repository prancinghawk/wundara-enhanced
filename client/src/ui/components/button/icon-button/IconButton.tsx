import {ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode} from "react";

import {Icon} from "../../../elements";

import {cn} from "../../../utils/utils";
import {MdAdd} from "react-icons/md";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    disabled?: boolean;
    icon?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    variant?: "filled" | "tonal" | "outlined" | "standard";
}

const IconButton: FC<IconButtonProps> = ({
    className,
    disabled,
    icon = <MdAdd size={24} />,
    onClick,
    variant = "filled",
    ...props
}: IconButtonProps) => {
    return (
        <button
            className={cn(`iconBtn ${variant} ${className || ""}`)}
            disabled={disabled}
            onClick={onClick}
            {...props}>
            <Icon icon={icon} />
        </button>
    );
};

export {IconButton};
