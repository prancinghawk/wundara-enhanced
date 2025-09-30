import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface ImageRowProps {
    children?: ReactNode;
    className?: string;
}

const ImageRow: FC<ImageRowProps> = ({children, className}: ImageRowProps) => {
    return (
        <div className={cn(`flex flex-row gap-[8px] ${className || ""}`)}>
            {children}
        </div>
    );
};

export {ImageRow};
