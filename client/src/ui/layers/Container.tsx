import {ReactNode} from "react";

import {cn} from "../../utils/utils";

interface ContainerProps {
    className?: string;
    padding?: string;
    children?: ReactNode;
}

function Container({className, padding, children}: ContainerProps) {
    return (
        <div
            className={cn(
                `my-[24px] flex gap-2 rounded-large ${padding || "p-6"}  ${
                    className || "mx-[24px] overflow-x-scroll"
                }`
            )}
            style={{
                backgroundImage:
                    "radial-gradient(#64748B 0.5px, transparent 0.5px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "10px 10px",
            }}>
            {children}
        </div>
    );
}

export {Container};
