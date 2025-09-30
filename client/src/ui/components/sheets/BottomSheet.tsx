import {FC, MouseEventHandler, ReactNode, useEffect, useId} from "react";

interface BottomSheetProps {
    isVisible?: boolean;
    onClose?: MouseEventHandler<HTMLDivElement>;
    dragHandle?: boolean;
    children?: ReactNode;
}

const BottomSheet: FC<BottomSheetProps> = ({
    isVisible,
    onClose,
    dragHandle,
    children,
}: BottomSheetProps) => {
    const bottomSheet = useId();

    useEffect(() => {
        document.body.style.overflow = isVisible ? "hidden" : "visible";
    }, [isVisible]);

    if (!isVisible) return null;

    const handleClose: MouseEventHandler<HTMLDivElement> = (e) => {
        const target = e.target as HTMLElement;
        if (onClose) {
            target?.id === bottomSheet && onClose(e);
        }
    };

    return (
        <div
            id={bottomSheet}
            onClick={handleClose}
            className="fixed inset-0 z-40 flex h-full w-full items-end justify-center overflow-y-hidden bg-scrim">
            <div className="mt-[56px] flex w-full max-w-[740px] animate-transition-bottom flex-col items-center justify-center sm:mb-[12px]">
                <div className="z-10 flex w-full flex-col overflow-y-auto rounded-extra-large bg-surface-container px-[24px] pb-[28px] scrollbar-hide">
                    <div className="flex items-center justify-center pt-[12px]">
                        {dragHandle && (
                            <div
                                onClick={onClose}
                                className="mb-[4px] flex cursor-pointer px-[16px] pb-[10px] pt-[6px]">
                                <div className="flex h-[4px] w-[32px] rounded-full bg-surface-container-highest" />
                            </div>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export {BottomSheet};
