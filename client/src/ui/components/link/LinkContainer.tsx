import {FC, ReactNode} from "react";

import Link from "next/link";

import {cn} from "../../utils/utils";

interface LinkContainerProps {
    children?: ReactNode;
    className?: string;
    color?: string;
    href: string;
    padding?: string;
    passHref?: boolean;
    size?: string;
    target?: string;
}

const LinkContainer: FC<LinkContainerProps> = ({
    children,
    className,
    color,
    href,
    padding,
    size,
    passHref,
    target = "_blank",
}: LinkContainerProps) => {
    return (
        <span
            className={cn(`mx-[0px] my-[0px] w-fit gap-2 truncate rounded-md  
      
      ${size ? size : "text-body-small"} 
      ${color ? color : "text-indigo-500 dark:text-indigo-300"}  
      ${padding ? padding : "py-[0px]"} 
      
      hover:underline hover:decoration-[1.5px] hover:underline-offset-[2px] ${
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

export {LinkContainer};
