import {FC, ReactNode, useState} from "react";

import {Icon} from "../../../elements";

import {cn} from "../../utils/utils";
import {MdCheck} from "react-icons/md";

interface SegmentedButtonsProps {
    buttons: {
        id?: string;
        header?: string;
        content?: ReactNode;
    }[];
    className?: string;
    icon?: ReactNode;
}

const SegmentedButtons: FC<SegmentedButtonsProps> = ({
    buttons,
    className,
    icon,
}: SegmentedButtonsProps) => {
    const [selectedId, setSelectedId] = useState(buttons[0].id);
    const selectedButton = buttons.find((buttons) => buttons.id === selectedId);

    return (
        <section className={cn(`flex w-full flex-col ${className || ""}`)}>
            <div className="mx-[12px] flex h-[60px] w-fit flex-row overflow-x-auto rounded-full border border-outline scrollbar-hide sm:mx-[20px]">
                {buttons.map((button) => (
                    <button
                        key={button.id}
                        onClick={() => setSelectedId(button.id)}
                        className={`flex h-full min-w-max max-w-[160px] flex-auto items-center justify-center gap-[8px] px-[28px] text-center text-label-large ${
                            button.id === selectedId
                                ? "border-outline bg-surface-container text-on-surface"
                                : "bg-surface text-on-surface hover:bg-surface-container"
                        }`}>
                        {button.id === selectedId && (
                            <Icon iconLeft={icon || <MdCheck size={18} />} />
                        )}
                        <div className="flex w-fit flex-row">
                            {button.header}
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex w-full flex-col gap-[16px] pt-[16px] text-body-medium text-on-surface">
                {selectedButton !== undefined && selectedButton.content}
            </div>
        </section>
    );
};

export {SegmentedButtons};
