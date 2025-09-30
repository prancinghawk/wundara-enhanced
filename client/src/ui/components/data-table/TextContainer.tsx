import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface TextContainerProps {
    children?: ReactNode;
    data?: ReactNode;
    width?: string;
}

const TextContainer: FC<TextContainerProps> = ({
    children,
    data,
    width,
}: TextContainerProps) => {
    return (
        <div className={cn(`flex ${width || "w-[300px]"}`)}>
            {children || data}
        </div>
    );
};

export {TextContainer};
