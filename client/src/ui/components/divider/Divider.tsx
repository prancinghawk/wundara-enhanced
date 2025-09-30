import {FC} from "react";

import {cn} from "../../utils/utils";

interface DividerProps {
    className?: string;
}

const Divider: FC<DividerProps> = ({className}: DividerProps) => {
    return (
        <div
            className={cn(
                `flex w-full flex-row items-center text-on-surface ${
                    className || "my-[16px]"
                }`
            )}>
            <div className="flex h-[1px] w-full bg-outline"></div>
        </div>
    );
};

export {Divider};
