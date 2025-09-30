import {FC, ReactNode} from "react";

import {NavDrawerItem} from "./items/NavDrawerItem";

import {cn} from "../../utils/utils";

interface NavDrawerInProps {
    isVisible?: boolean;
    children?: ReactNode;
    className?: string;
}

interface NavigationDrawerComponent extends FC<NavDrawerInProps> {
    Item: typeof NavDrawerItem;
}

const NavigationDrawerIn: NavigationDrawerComponent = ({
    isVisible,
    children,
    className,
}: NavDrawerInProps) => {
    if (!isVisible) return null;

    return (
        <nav
            className={cn(
                `sticky left-0 top-0 flex h-screen min-w-[280px] max-w-[360px] flex-col overflow-y-auto bg-surface px-[12px] py-[28px] ${
                    className || ""
                }`
            )}>
            {children}
        </nav>
    );
};

NavigationDrawerIn.Item = NavDrawerItem;

export {NavigationDrawerIn};
