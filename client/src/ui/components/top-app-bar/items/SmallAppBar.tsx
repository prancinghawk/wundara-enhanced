import {FC, ReactNode} from "react";

interface SmallAppBarProps {
    leftElement?: ReactNode;
    rightElement?: ReactNode;
    title?: string;
    children?: ReactNode;
}

const SmallAppBar: FC<SmallAppBarProps> = ({
    leftElement,
    rightElement,
    title,
    children,
}: SmallAppBarProps) => {
    return (
        <div className="flex items-start">
            <div className="flex h-[64px] w-full items-center justify-center px-[8px] py-[6px]   text-on-surface">
                <div className={`${leftElement ? "pr-[12px]" : ""}`}>
                    {leftElement}
                </div>
                <p className="flex h-full w-full flex-row items-center pb-[2px] text-center text-title-large">
                    {title || children}
                </p>
                <div
                    className={`flex flex-row ${
                        rightElement ? "min-w-max pl-[12px]" : ""
                    }`}>
                    {rightElement}
                </div>
            </div>
        </div>
    );
};

export {SmallAppBar};
