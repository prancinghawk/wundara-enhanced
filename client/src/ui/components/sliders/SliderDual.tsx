import React, {
    FC,
    LegacyRef,
    MutableRefObject,
    ReactNode,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

interface SliderDualProps {
    max?: number;
    min?: number;
    onChange?: (value: {
        min: number | undefined;
        max: number | undefined;
    }) => void;
    step?: number;
    tooltipChildren?: ReactNode;
}

const SliderDual: FC<SliderDualProps> = ({
    max = 100,
    min = 0,
    onChange,
    step,
    tooltipChildren,
}: SliderDualProps) => {
    const [minVal, setMinVal] = useState<number>(min || 0);
    const [maxVal, setMaxVal] = useState<number>(max || 0);
    const minValRef: MutableRefObject<number | undefined> = useRef(min || 0);
    const maxValRef: MutableRefObject<number | undefined> = useRef(max || 0);
    const rangeLeft: LegacyRef<HTMLInputElement> = useRef(null);
    const rangeRight: LegacyRef<HTMLInputElement> = useRef(null);
    const progress: RefObject<HTMLDivElement> = useRef(null);
    const tooltipLeft: RefObject<HTMLDivElement> = useRef(null);
    const tooltipRight: RefObject<HTMLDivElement> = useRef(null);

    // Convert value to %
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef?.current ?? 0);

        if (progress.current) {
            progress.current.style.left = `${minPercent}%`;
            progress.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const maxPercent = getPercent(maxVal);
        const minPercent = getPercent(minValRef?.current ?? 0);

        if (progress.current) {
            progress.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        if (onChange) {
            onChange({min: minVal, max: maxVal});
        }
    }, [minVal, maxVal, onChange]);

    //Tooltips
    useEffect(() => {
        const thumbSize = 10;
        if (
            rangeLeft.current &&
            rangeRight.current &&
            tooltipLeft &&
            tooltipRight
        ) {
            const ratioLeft =
                (Number(rangeLeft.current.value) -
                    Number(rangeLeft.current.min)) /
                (Number(rangeLeft.current.max) - Number(rangeLeft.current.min));
            const ratioRight =
                (Number(rangeRight.current.value) -
                    Number(rangeRight.current.min)) /
                (Number(rangeRight.current.max) -
                    Number(rangeRight.current.min));
            const amountToMoveLeft =
                ratioLeft *
                    (rangeLeft.current.offsetWidth - thumbSize - thumbSize) +
                thumbSize;
            const amountToMoveRight =
                ratioRight *
                    (rangeRight.current.offsetWidth - thumbSize - thumbSize) +
                thumbSize;

            if (tooltipLeft.current) {
                tooltipLeft.current.style.left = amountToMoveLeft + "px";
            }

            if (tooltipRight.current) {
                tooltipRight.current.style.left = amountToMoveRight + "px";
            }
        }
    }, [minVal, maxVal]);

    return (
        <div className="relative flex h-[24px] w-full items-center justify-center">
            <input
                type="range"
                id="rangeLeft"
                ref={rangeLeft}
                min={min}
                max={max}
                step={step}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(
                        Number(event.target.value),
                        maxVal - 1
                    );
                    setMinVal(value);
                    minValRef.current = value;
                }}
                className="pointer-events-none absolute z-40 h-[6px] w-full appearance-none bg-black/0 outline-none"
            />
            <input
                type="range"
                id="rangeRight"
                ref={rangeRight}
                min={min}
                max={max}
                step={step}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(
                        Number(event.target.value),
                        minVal + 1
                    );
                    setMaxVal(value);
                    maxValRef.current = value;
                }}
                className="absolute z-30 h-[6px] w-full appearance-none bg-white/0 outline-none"
            />

            <div className="relative h-[24px] w-full">
                <div className="absolute top-[9px] z-10 h-[6px] w-full rounded-full bg-surface-container-high" />
                <div
                    ref={progress}
                    className="absolute top-[9px] z-10 h-[6px] rounded-full bg-primary"
                />
                <div
                    id="tooltipLeft"
                    ref={tooltipLeft}
                    className={`${
                        minVal < min + 1 && "invisible"
                    } absolute top-[-40px] z-[19] flex h-[32px] min-w-[32px] max-w-[96px] -translate-x-1/2 items-center justify-center rounded-full bg-surface-container-high px-[4px] align-middle text-body-small text-on-surface`}>
                    <div className="absolute bottom-[-5px] flex">
                        <div className=" border-l-[10px] border-r-[10px] border-t-[8.5px] border-l-transparent border-r-transparent border-t-surface-container-high"></div>
                    </div>
                    <div className={`${tooltipChildren && "flex pr-[2px]"}`}>
                        {minVal}
                    </div>{" "}
                    {tooltipChildren}
                </div>
                <div
                    id="tooltipRight"
                    ref={tooltipRight}
                    className={`${
                        maxVal > max - 1 && "invisible"
                    } min-w- absolute top-[-40px] z-[19] flex h-[32px] min-w-[32px] max-w-full -translate-x-1/2 flex-row items-center justify-center rounded-full bg-surface-container-high px-[4px] align-middle text-body-small text-on-surface`}>
                    <div className="absolute bottom-[-5px] flex">
                        <div className="border-l-[10px] border-r-[10px] border-t-[8.5px] border-l-transparent border-r-transparent border-t-surface-container-high"></div>
                    </div>
                    <div className={`${tooltipChildren && "flex pr-[2px]"}`}>
                        {maxVal}
                    </div>
                    {tooltipChildren}
                </div>
            </div>
        </div>
    );
};

export {SliderDual};
