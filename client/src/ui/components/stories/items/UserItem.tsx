import {FC, MouseEventHandler, ReactNode} from "react";

import Image from "next/image";

import {Badge} from "../../badge/Badge";

interface UserItemProps {
    badge?: boolean;
    badgeColor?: string;
    badgeIcon?: ReactNode;
    badgeText?: string;
    live?: boolean;
    liveColor?: string;
    liveIcon?: ReactNode;
    liveText?: string;
    name?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    radius?: number;
    ring?: boolean;
    size?: number;
    src?: string;
}

const UserItem: FC<UserItemProps> = ({
    badge,
    badgeColor,
    badgeText,
    badgeIcon,
    live,
    liveColor,
    liveIcon,
    liveText,
    name,
    onClick,
    radius,
    ring,
    size,
    src,
}: UserItemProps) => {
    return (
        <div className="relative flex max-w-min flex-col">
            <div>
                <div
                    className="relative z-10 flex cursor-pointer items-center justify-center rounded-full bg-surface-container-low text-body-small text-on-surface-variant"
                    style={{
                        width: size,
                        height: size,
                    }}
                    onClick={onClick}>
                    {badge && (
                        <div className="absolute right-[-2px] top-[-2px] z-10 flex h-[16px] w-[16px] justify-end">
                            <Badge
                                className={badgeColor}
                                text={badgeText}
                                icon={badgeIcon}
                            />
                        </div>
                    )}
                    {live && (
                        <div className="absolute bottom-[-4px] z-10 flex h-fit w-[16px] min-w-max justify-center rounded-full">
                            <Badge
                                className={liveColor}
                                text={liveText}
                                icon={liveIcon}
                            />
                        </div>
                    )}
                    {src && (
                        <Image
                            src={src}
                            alt=""
                            role={"presentation"}
                            aria-hidden={true}
                            fill
                            priority={true}
                            sizes="100%"
                            style={{
                                objectFit: "cover",
                                borderRadius: radius ? radius : 999,
                            }}
                        />
                    )}
                </div>
            </div>
            {name && (
                <div className="flex w-full items-center justify-center pt-[8px] text-center text-label-medium leading-tight text-on-surface">
                    {name}
                </div>
            )}
            {ring && (
                <div
                    className={
                        "absolute left-[-4px] top-[-4px] z-0 flex animate-spin-lazy rounded-full bg-gradient-to-r from-green-400 via-blue-600 to-purple-600 p-[2px] dark:from-green-300 dark:via-blue-500 dark:to-purple-600"
                    }
                    style={{
                        width: size ? size + 8 : undefined,
                        height: size ? size + 8 : undefined,
                    }}>
                    <div className="flex h-full w-full rounded-full bg-surface" />
                </div>
            )}
        </div>
    );
};

export {UserItem};
