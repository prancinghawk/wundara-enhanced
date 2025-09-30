import {FC, MouseEventHandler, ReactNode} from "react";

import Image from "next/image";

import {Badge} from "../badge/Badge";
import {DotBadge} from "../badge/DotBadge";
import {OnIconBadge} from "../badge/OnIconBadge";

import {MdPhoto} from "react-icons/md";

export interface AvatarProps {
    alt?: string;
    badge?: boolean;
    badgeColor?: string;
    badgeIcon?: ReactNode;
    badgeText?: string;
    dotBadge?: boolean;
    height?: number | undefined;
    name?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    radius?: number;
    ring?: boolean;
    size?: number;
    smallBadge?: boolean;
    src?: string;
    width?: number | undefined;
}

const Avatar: FC<AvatarProps> = ({
    alt,
    badge,
    badgeColor,
    badgeIcon,
    badgeText,
    dotBadge,
    height,
    name,
    onClick,
    radius = 999,
    ring,
    size = 40,
    smallBadge,
    src,
    width,
}: AvatarProps) => {
    return (
        <div className={"relative flex"}>
            <div
                className="relative z-10 flex cursor-pointer items-center justify-center  bg-surface-container text-body-small text-on-surface-variant transition-all duration-300 ease-in-out"
                style={{
                    width: width || size,
                    height: height || size,
                    borderRadius: radius,
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

                {dotBadge && (
                    <div className="absolute right-[0px] top-[0px] z-10 flex h-[16px] w-[16px] justify-end">
                        <DotBadge className={badgeColor} />
                    </div>
                )}

                {smallBadge && (
                    <div className="absolute right-[4px] top-[4px] z-10 flex items-center justify-center">
                        <OnIconBadge
                            className={badgeColor}
                            count={badgeText}
                        />
                    </div>
                )}

                {src && (
                    <Image
                        src={src}
                        alt={alt || ""}
                        role={"presentation"}
                        aria-hidden={true}
                        fill
                        priority={true}
                        sizes="100%"
                        style={{
                            objectFit: "cover",
                            borderRadius: radius,
                        }}
                    />
                )}
                <div className="flex overflow-hidden overflow-ellipsis px-[4px] text-center leading-tight">
                    {name || <MdPhoto size={18} />}
                </div>
            </div>

            {/*Be careful with different width and height*/}
            {ring && (
                <div
                    className={
                        "absolute left-[-4px] top-[-4px] z-0 flex animate-spin-lazy bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 p-[2px] dark:from-green-300 dark:via-blue-500 dark:to-purple-600"
                    }
                    style={{
                        width: width !== undefined ? width + 8 : size + 8,
                        height: height !== undefined ? height + 8 : size + 8,
                        borderRadius: radius + 4,
                    }}>
                    <div
                        className="flex h-full w-full bg-surface"
                        style={{
                            borderRadius: radius + 4,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export {Avatar};
