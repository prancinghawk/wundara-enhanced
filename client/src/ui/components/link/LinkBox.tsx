import {FC, ReactNode} from "react";

import Link from "next/link";

import {cn} from "../../utils/utils";

interface LinkBoxProps {
    children?: ReactNode;
    className?: string;
    color?: string;
    href: string;
    padding?: string;
    passHref?: boolean;
    size?: string;
    target?: string;
}

const LinkBox: FC<LinkBoxProps> = ({
    children,
    className,
    color,
    href,
    padding,
    size,
    passHref,
    target = "_blank",
}: LinkBoxProps) => {
    return (
        <span
            className={cn(`mx-[0px] my-[0px] w-fit gap-2 truncate rounded-md

      ${size || "text-body-small"}
      ${color || "text-primary"}
      ${padding || "py-[0px]"}

      rounded-small py-[8px] hover:underline hover:decoration-[1px] hover:underline-offset-[2px] ${
          className || ""
      }`)}>
            <Link
                href={href}
                passHref={passHref}
                target={target}>
                {children}
            </Link>
        </span>
    );
};

export {LinkBox};
