import {ReactNode} from "react";

interface SearchItemProps {
    label?: string;
    rightElement?: ReactNode;
    leftElement?: ReactNode;
    children?: ReactNode;
    id?: string;
}

const SearchItem = ({
    label,
    rightElement,
    leftElement,
    children,
    id,
}: SearchItemProps) => {
    return (
        <div
            className="flex  items-start"
            key={id}>
            <div className="flex h-[48px] w-full cursor-pointer items-center justify-start bg-surface-container-low pl-[16px] pr-[16px] text-label-large  text-on-surface hover:bg-surface-container-lowest hover:text-on-surface">
                <div
                    className={`${
                        leftElement && "pr-[16px] text-on-surface-variant"
                    }`}>
                    {leftElement}
                </div>
                <p className="flex w-full items-center gap-[16px] truncate">
                    {label || children}
                </p>
                <div
                    className={`${
                        rightElement &&
                        "min-w-max pl-[28px] text-body-small text-on-surface-variant"
                    }`}>
                    {rightElement}
                </div>
            </div>
        </div>
    );
};

export {SearchItem};
