import {FC, MouseEventHandler} from "react";

import Image, {StaticImageData} from "next/image";

interface ImgProps {
    alt?: string;
    aspect?: number | string;
    className?: string;
    color?: string;
    height?: number | string;
    objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
    onClick?: MouseEventHandler<HTMLDivElement>;
    placeholder?: "blur" | "empty" | undefined;
    quality?: number;
    radius?: number;
    size?: number | string;
    src?: string | StaticImageData;
    unoptimized?: boolean;
    width?: number | string;
}

const Img: FC<ImgProps> = ({
    alt,
    aspect,
    color,
    className,
    height,
    objectFit,
    onClick,
    placeholder,
    quality,
    radius,
    size,
    src,
    unoptimized,
    width,
}: ImgProps) => {
    return (
        <div
            className={`relative flex h-full w-full cursor-pointer ${
                className || ""
            } ${color || "bg-surface-container-lowest"}`}
            onClick={onClick}
            style={{
                width: width || size,
                height: height || size,
                aspectRatio: aspect,
                borderRadius: radius,
            }}>
            <Image
                src={src ?? ""}
                alt={alt || "img"}
                fill
                quality={quality}
                unoptimized={unoptimized}
                priority={true}
                sizes="100%"
                placeholder={placeholder}
                style={{
                    objectFit: objectFit || "cover",
                    borderRadius: radius,
                }}
            />
        </div>
    );
};

export {Img};
