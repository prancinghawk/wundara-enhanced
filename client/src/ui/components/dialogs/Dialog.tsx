import {FC, ReactNode, useEffect, useId} from "react";

import {DialogBody} from "./DialogBody";
import {DialogFooter} from "./DialogFooter";
import {DialogHeader} from "./DialogHeader";

interface DialogProps {
    body?: ReactNode;
    button?: ReactNode;
    children?: ReactNode;
    headline?: string;
    icon?: ReactNode;
    isVisible: boolean;
    onClose: () => void;
    text?: string;
}

interface DialogComponent extends FC<DialogProps> {
    Header: typeof DialogHeader;
    Body: typeof DialogBody;
    Footer: typeof DialogFooter;
}

const Dialog: DialogComponent = ({
    children,
    isVisible,
    onClose,
}: DialogProps) => {
    const scrim = useId();

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const handleClose = (e: any) => {
        e.target.id === scrim && onClose();
    };

    return (
        <div
            id={scrim}
            onClick={handleClose}
            className={`fixed inset-0 z-20 flex bg-black/50`}>
            <div className="z-50 flex  flex-col items-center justify-center overflow-hidden">
                <div className="absolute left-1/2 top-1/2 z-10 flex w-11/12 min-w-[280px] max-w-[580px] -translate-x-1/2 -translate-y-1/2 animate-fade-in flex-col gap-[16px] rounded-[28px] bg-surface-container pt-[24px]">
                    {/*header*/}
                    {children}
                </div>
            </div>
        </div>
    );
};

Dialog.Header = DialogHeader;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;

export {Dialog};
