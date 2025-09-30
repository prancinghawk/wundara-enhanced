import {FC, ReactNode} from "react";

import {cn} from "../../utils/utils";

interface SectionProps {
    children: ReactNode;
    className?: string;
}

const Section: FC<SectionProps> = ({children, className}: SectionProps) => {
    return (
        <>
            <section
                className={cn(
                    `flex h-fit w-full flex-col items-center gap-[24px] px-[12px] lg:flex-row ${
                        className || ""
                    }`
                )}>
                {children}
            </section>
        </>
    );
};

export {Section};
