import {FC, ReactNode} from "react";

interface SnackbarProps {
    isVisible: boolean;
    text: string;
    button?: ReactNode;
}

const Snackbar: FC<SnackbarProps> = ({
    isVisible,
    text,
    button,
}: SnackbarProps) => {
    if (!isVisible) return null;

    return (
        <div className="flex max-h-[68px] min-h-[48px] w-full max-w-[900px] animate-transition-bottom items-center justify-between rounded-[8px] bg-inverse-surface pl-[16px] pr-[12px] text-body-medium text-inverse-on-surface sm:min-w-[800] sm:gap-[48px] sm:py-0">
            <div className="flex py-[8px]">{text}</div>
            <div className="flex flex-row">{button}</div>
        </div>
    );
};

export {Snackbar};
