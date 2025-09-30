import {ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode} from "react";

import {Icon} from "../../../elements";

import {cn} from "../../utils/utils";
import {MdAdd} from "react-icons/md";

interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    icon?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    size?: "fabSmall" | "fab" | "fabLarge";
    variant?: "surface" | "secondary" | "tertiary";
}

const FAB: FC<FABProps> = ({
    className,
    icon = <MdAdd size={24} />,
    onClick,
    size = "fab",
    variant = "surface",
    ...props
}: FABProps) => {
    return (
        <button
            className={cn(`${size} ${variant} ${className || ""}`)}
            onClick={onClick}
            {...props}>
            <Icon icon={icon} />
        </button>
    );
};

export {FAB};
