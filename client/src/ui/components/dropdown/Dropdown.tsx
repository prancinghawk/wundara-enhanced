import {FC, ReactNode, useEffect, useRef, useState} from "react";

import {event} from "next/dist/build/output/log";

import {DropdownItem} from "./DropdownItem";
import {cn} from "../../utils/utils";

interface DropdownProps {
    children: ReactNode;
    className?: string;
    menu?: ReactNode;
    apart?: boolean;
}

interface DropdownComponent extends FC<DropdownProps> {
    Item: typeof DropdownItem;
}

const Dropdown: DropdownComponent = ({
    children,
    className,
    menu,
    apart,
}: DropdownProps) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const wrapper = useRef<HTMLDivElement>(null);
    const dropdown = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        const wrapperRef = wrapper.current;
        const dropdownRef = dropdown.current;

        document.addEventListener("click", (event: MouseEvent) => {
            if (
                wrapperRef &&
                dropdownRef &&
                !wrapperRef.contains(event.target as Node) &&
                !dropdownRef.contains(event.target as Node)
            ) {
                setIsActive(false);
            }
        });

        return () => {
            document.removeEventListener("click", event);
        };
    }, [isActive]);

    return (
        <div
            ref={wrapper}
            onClick={handleClick}
            className={cn(
                `relative flex w-fit cursor-pointer appearance-none ${
                    className || ""
                }`
            )}>
            {children}
            <div
                ref={dropdown}
                className={`${!isActive ? "hidden" : ""}
          absolute top-full z-30 mb-[4px] flex w-full flex-col`}>
                <div
                    className={`z-50 flex max-h-[310px] min-w-max animate-transition-top flex-col overflow-hidden overflow-y-auto rounded-b-[8px] bg-surface-container py-[8px] shadow-mm-1 ${
                        apart && "mt-[4px] rounded-[8px]"
                    }`}>
                    <>{menu}</>
                </div>
            </div>
        </div>
    );
};

Dropdown.Item = DropdownItem;

export {Dropdown};
