import {ReactNode} from "react";

interface BlobProps {
    className?: string;
    children?: ReactNode;
    color?: string;
    delay?: number;
    height?: number;
    position?: string;
    width?: number;
}

function Blob({
    className,
    width,
    height,
    position,
    children,
    color,
    delay,
}: BlobProps) {
    return (
        <div
            className={`pointer-events-none absolute z-0 flex h-screen w-screen animate-blob items-center justify-center rounded-full blur-[100px] filter ${
                width || "h-[300px] w-[300px]"
            }
      ${position || "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}  
      ${color || "bg-cyan-400/10 dark:bg-cyan-400/5"}   
      ${className || ""}`}
            style={{
                animationDelay: delay + "ms",
                width: width,
                height: height,
            }}>
            {children}
        </div>
    );
}

Blob.propTypes = {};

export {Blob};
