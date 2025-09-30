import {FC, MouseEventHandler} from "react";

import Image from "next/image";

interface BusinessItemProps {
    height?: number;
    onClick?: MouseEventHandler<HTMLDivElement>;
    radius?: number;
    ring?: boolean;
    src?: string;
    text?: string;
    width?: number;
}

const BusinessItem: FC<BusinessItemProps> = ({
    height,
    onClick,
    radius,
    ring,
    src,
    text,
    width,
}: BusinessItemProps) => {
    return (
        <div className="flex max-w-min flex-col">
            <div
                className={`${
                    ring
                        ? "flex items-center rounded-full p-[2px] ring ring-primary"
                        : "flex rounded-full p-[2px]"
                }`}
                style={{
                    borderRadius: radius ? radius + 2 : 999,
                }}>
                <div
                    className="relative flex cursor-pointer items-center justify-center rounded-full text-body-small text-on-surface-variant"
                    style={{
                        width: width,
                        height: height,
                    }}
                    onClick={onClick}>
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
            {text && (
                <div className="flex w-full items-center justify-start px-[8px] pt-[8px] text-left text-label-large leading-tight text-on-surface">
                    {text}
                </div>
            )}
        </div>
    );
};

export {BusinessItem};
