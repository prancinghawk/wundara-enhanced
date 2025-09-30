import React, {FC, ReactNode} from "react";

import Link from "next/link";
import {useRouter} from "next/router";

import {Badge} from "../../badge/Badge";

interface NavDrawerItemProps {
    badge?: boolean;
    badgeColor?: string;
    badgeText?: string;
    children?: ReactNode;
    id?: string;
    label?: string;
    leftElement?: ReactNode;
    rightElement?: ReactNode;
    url?: string;
}

const NavDrawerItem: FC<NavDrawerItemProps> = ({
    badge,
    badgeColor,
    badgeText,
    children,
    id,
    label,
    leftElement,
    rightElement,
    url,
}: NavDrawerItemProps) => {
    const router = useRouter();

    return (
        <Link href={url || ""}>
            <div
                className="flex cursor-pointer items-start"
                key={id}>
                <div
                    className={`flex h-full w-full cursor-pointer items-center justify-center rounded-full py-[14px] pl-[16px] pr-[24px] text-label-large text-on-surface hover:bg-surface-container ${
                        router.asPath === url ? "bg-surface-container" : ""
                    }`}>
                    <div
                        className={`${
                            leftElement && "pr-[12px] text-on-surface-variant"
                        }`}>
                        {leftElement}
                    </div>
                    <p className="flex w-full">{label || children}</p>
                    <div
                        className={`pl-[12px] text-body-small ${
                            rightElement && "min-w-max text-on-surface-variant"
                        }`}>
                        {rightElement}
                    </div>
                    <div
                        className={`${
                            badge && "pl-[12px] text-on-surface-variant"
                        }`}>
                        {badge && (
                            <Badge
                                className={badgeColor}
                                text={badgeText || "New"}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export {NavDrawerItem};
