import {ReactNode, useEffect, useRef, useState} from "react";

import {OverflowMenuItem} from "./OverflowMenuItem";

interface OverflowMenuProps {
    bottomLeft?: boolean;
    bottomRight?: boolean;
    children?: ReactNode;
    menu?: ReactNode;
    overflow?: string;
    topLeft?: boolean;
    topRight?: boolean;
}

const OverflowMenu = ({
    bottomLeft,
    bottomRight,
    children,
    menu,
    overflow = "overflow-y-auto",
    topLeft,
    topRight,
}: OverflowMenuProps) => {
    const [isActive, setIsActive] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const handleClick = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        const wrapperId = wrapperRef.current;
        const menuId = menuRef.current;

        document.addEventListener("click", (event) => {
            if (
                wrapperId &&
                menuId &&
                !wrapperId.contains(event.target as Node) &&
                !menuId.contains(event.target as Node)
            ) {
                setIsActive(false);
            }
        });

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [isActive]);

    return (
        <div
            ref={wrapperRef}
            onClick={handleClick}
            className="relative flex w-fit cursor-pointer">
            {children}
            <div
                ref={menuRef}
                className={`absolute ${!isActive ? "hidden" : ""}
      
          ${topRight ? "bottom-full right-0" : ""}
          ${topLeft ? "bottom-full left-0" : ""}
          ${bottomRight ? "right-0 top-full" : ""}
          ${bottomLeft ? "left-0 top-full" : ""}
      
          z-20 my-[8px] flex max-h-[310px] min-w-max max-w-[280px] flex-col ${overflow} animate-fade-in rounded-[8px] bg-surface-container-high py-[8px] shadow-mm-1`}>
                {menu}
            </div>
        </div>
    );
};

OverflowMenu.Item = OverflowMenuItem;

export {OverflowMenu};
