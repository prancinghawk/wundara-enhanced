import React from "react";

export interface IconProps {
    iconLeft?: React.ReactNode | undefined;
    icon?: React.ReactNode | undefined;
    iconRight?: React.ReactNode | undefined;
    className?: string;
}

const Icon = ({iconLeft, icon, iconRight, className}: IconProps) => {
    return (
        <>
            {iconLeft && <div className={`${className || ""}`}>{iconLeft}</div>}
            {icon && <div className={`${className || ""}`}>{icon}</div>}
            {iconRight && (
                <div className={`${className || ""}`}>{iconRight}</div>
            )}
        </>
    );
};

export {Icon};
