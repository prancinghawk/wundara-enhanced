import {FC, ReactNode} from "react";

import {CardBody} from "./CardBody";
import {CardFooter} from "./CardFooter";
import {CardHeader} from "./CardHeader";

import {cn} from "../../utils/utils";

interface CardProps {
    bg?: string;
    children?: ReactNode;
    className?: string;
    padding?: string;
    width?: string;
}

interface CardComponent extends FC<CardProps> {
    Body: typeof CardBody;
    Footer: typeof CardFooter;
    Header: typeof CardHeader;
}

const Card: CardComponent = ({
    children,
    className,
    bg,
    padding,
    width,
}: CardProps) => {
    return (
        <div
            className={cn(`flex h-fit flex-col gap-[8px] rounded-extra-large text-on-surface 
      ${width || "w-full"}   
      ${padding || "p-[12px]"}
      ${bg || "bg-surface-container"} 
      ${className || ""}`)}>
            {children}
        </div>
    );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export {Card};
