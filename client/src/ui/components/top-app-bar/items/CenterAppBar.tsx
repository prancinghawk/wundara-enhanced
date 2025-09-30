import {FC, ReactNode} from "react";

interface CenterAppBarProps {
    leftElement?: ReactNode;
    rightElement?: ReactNode;
    title?: string;
    children?: ReactNode;
}

const CenterAppBar: FC<CenterAppBarProps> = ({
    leftElement,
    rightElement,
    title,
    children,
}: CenterAppBarProps) => {
    return (
        <div className="flex items-start">
            <div className="flex h-[64px] w-full items-center justify-center px-[8px] py-[6px]">
                <div className={`${leftElement && "pr-[12px]"}`}>
                    {leftElement}
                </div>
                <p className="flex h-full w-full flex-row items-center justify-center pb-[2px] text-center text-title-large">
                    {title || children}
                </p>
                {rightElement ? (
                    <div className="flex min-w-max flex-row pl-[12px] text-body-small">
                        {rightElement}
                    </div>
                ) : (
                    <div className="h-[48px] w-[84px]"></div>
                )}
            </div>
        </div>
    );
};

export {CenterAppBar};
