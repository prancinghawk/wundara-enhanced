import React, {FC, ReactNode, useEffect, useRef, useState} from "react";

import {event} from "next/dist/build/output/log";

import {cn} from "../../utils/utils";

interface SearchProps {
    children: ReactNode;
    result?: ReactNode;
}

const Search: FC<SearchProps> = ({children, result}: SearchProps) => {
    const [isActive, setIsActive] = useState(false);
    const wrapper = useRef<HTMLDivElement>(null);
    const results = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        setIsActive(true);
    };

    useEffect(() => {
        const wrapperRef = wrapper.current;
        const resultRef = results.current;

        document.addEventListener("click", (event) => {
            if (
                wrapperRef &&
                resultRef &&
                !wrapperRef.contains(event.target as Node) &&
                !resultRef.contains(event.target as Node)
            ) {
                setIsActive(false);
            }
        });

        return () => {
            document.removeEventListener("click", event);
        };
    }, [isActive]);

    return (
        <div
            ref={wrapper}
            onClick={handleClick}
            className={cn(
                `relative z-[30] flex h-fit w-full min-w-[280px] max-w-[720px] cursor-pointer ${
                    isActive ? "rounded-t-[32px]" : "rounded-full"
                } bg-surface-container-low`
            )}>
            {children}
            <div
                ref={results}
                className={`${!isActive ? "hidden" : ""} 
          absolute -left-0 top-full  mb-[4px] flex w-full flex-col `}>
                <div
                    className={`flex max-h-[310px] animate-transition-top flex-col overflow-hidden overflow-y-auto rounded-b-[32px] bg-surface-container-low py-[8px]`}>
                    <>{result}</>
                </div>
            </div>
        </div>
    );
};

export {Search};
