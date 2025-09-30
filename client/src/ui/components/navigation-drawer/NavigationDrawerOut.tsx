import {FC, ReactNode, useId} from "react";

import {NavDrawerItem} from "./items/NavDrawerItem";

import {cn} from "../../utils/utils";

interface NavDrawerOutProps {
    isVisible?: boolean;
    children?: ReactNode;
    onClose?: () => void;
    className?: string;
}

interface NavigationDrawerComponent extends FC<NavDrawerOutProps> {
    Item: typeof NavDrawerItem;
}

const NavigationDrawerOut: NavigationDrawerComponent = ({
    isVisible,
    onClose,
    children,
    className,
}: NavDrawerOutProps) => {
    const scrim = useId();
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (onClose) {
            e.target.id === scrim && onClose();
        }
    };

    return (
        <>
            <div
                id={scrim}
                onClick={handleClose}
                className="fixed inset-0 z-40 flex bg-scrim"></div>

            <nav
                onClick={onClose}
                className={cn(
                    `fixed left-0 top-0 z-50 flex h-screen min-w-[300px] max-w-[360px] transform animate-transition-left flex-col overflow-y-auto rounded-r-[16px] bg-surface px-[12px] py-[28px] scrollbar-hide ${
                        className || ""
                    }`
                )}>
                {children}
            </nav>
        </>
    );
};

NavigationDrawerOut.Item = NavDrawerItem;

export {NavigationDrawerOut};
