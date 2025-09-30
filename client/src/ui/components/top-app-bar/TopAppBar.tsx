import {FC, ReactNode} from "react";

import {CenterAppBar} from "./items/CenterAppBar";
import {LargeAppBar} from "./items/LargeAppBar";
import {MediumAppBar} from "./items/MediumAppBar";
import {SmallAppBar} from "./items/SmallAppBar";

import {cn} from "../../utils/utils";

interface TopAppBarProps {
    className?: string;
    children?: ReactNode;
    bg?: string;
}

interface TopAppBarComponent extends FC<TopAppBarProps> {
    Small: typeof SmallAppBar;
    Medium: typeof MediumAppBar;
    Large: typeof LargeAppBar;
    Center: typeof CenterAppBar;
}

const TopAppBar: TopAppBarComponent = ({
    className,
    children,
    bg,
}: TopAppBarProps) => {
    return (
        <div
            className={cn(`flex w-full flex-col text-on-surface 
      ${bg || "bg-surface-container"}
      ${className || ""}
      `)}>
            {children}
        </div>
    );
};

TopAppBar.Small = SmallAppBar;
TopAppBar.Medium = MediumAppBar;
TopAppBar.Large = LargeAppBar;
TopAppBar.Center = CenterAppBar;

export {TopAppBar};
