import {FC, ReactNode} from "react";

interface DialogHeaderProps {
    icon?: ReactNode;
    headline?: string;
    text?: string;
}

const DialogHeader: FC<DialogHeaderProps> = ({
    icon,
    headline,
    text,
}: DialogHeaderProps) => {
    return (
        <>
            <div className="flex items-center justify-center px-[24px] text-on-surface">
                {icon}
            </div>
            <div className="flex items-center justify-center px-[24px] text-headline-small text-on-surface">
                {headline}
            </div>
            <p className="flex items-center justify-center px-[24px] text-body-medium text-on-surface-variant">
                {text}
            </p>
        </>
    );
};

export {DialogHeader};
