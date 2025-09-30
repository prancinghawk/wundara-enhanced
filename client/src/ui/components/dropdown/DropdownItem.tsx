import {FC, ReactNode} from "react";

interface DropdownItemProps {
    children?: ReactNode;
    id?: string;
    label?: string;
    leftElement?: ReactNode;
    rightElement?: ReactNode;
}

const DropdownItem: FC<DropdownItemProps> = ({
    children,
    label,
    leftElement,
    rightElement,
    id,
}: DropdownItemProps) => {
    return (
        <div
            className="flex items-start"
            key={id}>
            <div className="z-50 flex h-[48px] w-full cursor-pointer items-center justify-start pl-[12px] pr-[24px] text-label-large text-on-surface hover:bg-surface-container-high hover:text-on-surface">
                <div
                    className={`${
                        leftElement && "pr-[12px] text-on-surface-variant"
                    }`}>
                    {leftElement}
                </div>
                <p className="flex w-full">{label || children}</p>
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

export {DropdownItem};
