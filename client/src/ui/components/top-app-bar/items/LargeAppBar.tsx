import {FC, ReactNode} from "react";

interface LargeAppBarProps {
    leftElement?: ReactNode;
    rightElement?: ReactNode;
    title?: string;
    children?: ReactNode;
}

const LargeAppBar: FC<LargeAppBarProps> = ({
    leftElement,
    rightElement,
    title,
    children,
}: LargeAppBarProps) => {
    return (
        <div className="flex min-h-[152px] flex-col items-start justify-between pb-[28px]">
            <div className="flex h-[64px] w-full items-center justify-between px-[8px]  text-on-surface ">
                <div className={`${leftElement ? "pr-[12px]" : ""}`}>
                    {leftElement}
                </div>

                <div
                    className={`flex flex-row ${
                        rightElement
                            ? "min-w-max pl-[12px] text-body-small"
                            : ""
                    }`}>
                    {rightElement}
                </div>
            </div>
            <div className="flex w-full flex-row">
                <p className="flex h-full w-full flex-row items-center  pl-[16px] pr-[16px] text-headline-medium">
                    {title || children}
                </p>
            </div>
        </div>
    );
};

export {LargeAppBar};
