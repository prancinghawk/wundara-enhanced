import {FC, ReactNode, useCallback, useEffect, useRef, useState} from "react";

interface SliderProps {
    max?: number;
    min?: number;
    onChange?: (value: {min: number}) => void;
    step?: number;
    tooltipChildren?: ReactNode;
}

const Slider: FC<SliderProps> = ({
    max = 100,
    min = 0,
    onChange,
    step,
    tooltipChildren,
}: SliderProps) => {
    const [value, setValue] = useState<number>(0);
    const progress = useRef<HTMLDivElement>(null);
    const tooltip = useRef<HTMLDivElement>(null);
    const range = useRef<HTMLInputElement>(null);

    // Convert value to %
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [max, min]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const maxPercent = getPercent(value);
        if (progress.current) {
            progress.current.style.width = `${maxPercent}%`;
        }
    }, [value, getPercent]);

    // Get values when their state changes
    useEffect(() => {
        if (onChange) {
            onChange({min: value});
        }
    }, [value, onChange]);

    //Tooltips
    useEffect(() => {
        const thumbSize = 10;
        if (range.current && tooltip.current) {
            const ratio =
                (Number(range.current.value) - Number(range.current.min)) /
                (Number(range.current.max) - Number(range.current.min));
            const amountToMove =
                ratio * (range.current.offsetWidth - thumbSize - thumbSize) +
                thumbSize;
            tooltip.current.style.left = amountToMove + "px";
        }
    }, [value]);

    return (
        <div className="relative flex h-[24px] w-full items-center">
            <input
                className="relative z-[9] flex h-[6px] w-full transform appearance-none rounded-full bg-surface-container-high"
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                ref={range}
                onChange={({target: {value: radius}}) => {
                    setValue(parseInt(radius));
                }}
            />

            <div
                ref={progress}
                className="pointer-events-none absolute top-[9px] z-[10] h-[6px] rounded-full bg-primary"
            />

            <div
                ref={tooltip}
                className={`${
                    value > 0 ? "visible" : "invisible"
                } absolute top-[-40px] z-[19] flex h-[32px] min-w-[32px] max-w-[96px] -translate-x-1/2 flex-row items-center justify-center gap-[2px] rounded-full bg-surface-container-high px-[4px] text-body-small text-on-surface`}>
                <div className="absolute bottom-[-5px] flex">
                    <div className="border-l-[10px] border-r-[10px] border-t-[8.5px] border-l-transparent border-r-transparent border-t-surface-container-high" />
                </div>
                <span>{value}</span> <span>{tooltipChildren}</span>
            </div>
        </div>
    );
};

export {Slider};
