import {FC, ReactNode} from "react";

import {NavBarItem} from "./NavBarItem";

import {cn} from "../../utils/utils";

interface NavigationBarProps {
    width?: string;
    children?: ReactNode;
}

interface NavigationComponent extends FC<NavigationBarProps> {
    Item: typeof NavBarItem;
}

const NavigationBar: NavigationComponent = ({
    width,
    children,
}: NavigationBarProps) => {
    return (
        <nav
            className={cn(
                `flex ${
                    width || "w-full"
                } h-[80px] flex-row bg-surface-container py-[8px] text-on-surface`
            )}>
            {children}
        </nav>
    );
};

NavigationBar.Item = NavBarItem;

export {NavigationBar};
