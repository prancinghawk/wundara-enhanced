import {FC, MouseEventHandler, ReactNode, useEffect, useId} from "react";

import {IconButton} from "../../components";
import {MdClose} from "react-icons/md";

interface BottomSheetProps {
    isVisible?: boolean;
    onClose?: MouseEventHandler<HTMLDivElement>;
    title?: string;
    children?: ReactNode;
    closeButton?: ReactNode;
}

const SideSheet: FC<BottomSheetProps> = ({
    isVisible,
    onClose,
    title,
    closeButton,
    children,
}: BottomSheetProps) => {
    const sideSheet = useId();

    useEffect(() => {
        document.body.style.overflow = isVisible ? "hidden" : "visible";
    }, [isVisible]);

    if (!isVisible) return null;

    const handleClose: MouseEventHandler<HTMLDivElement> = (e) => {
        const target = e.target as HTMLElement;
        if (onClose) {
            target?.id === sideSheet && onClose(e);
        }
    };

    return (
        <div
            id={sideSheet}
            onClick={handleClose}
            className="fixed inset-0 z-40 flex bg-black/20">
            <div className="fixed right-0 top-0 z-50 flex h-screen min-w-[360px] max-w-[380px] transform animate-transition-right flex-col overflow-y-auto rounded-l-large bg-surface-container px-[12px] py-[24px] scrollbar-hide sm:min-w-[440px] sm:max-w-[540px]">
                <div className="z-10 flex w-full flex-col bg-surface-container px-[12px] pb-[28px] scrollbar-hide">
                    <div className="flex items-center justify-center">
                        {title && (
                            <div className="flex w-full justify-start text-title-medium">
                                {title}
                            </div>
                        )}
                        {closeButton && (
                            <div
                                className="flex w-full justify-end"
                                onClick={onClose}>
                                <IconButton
                                    icon={<MdClose size={24} />}
                                    className="rounded-extra-large"
                                    variant="tonal"
                                />
                            </div>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export {SideSheet};
