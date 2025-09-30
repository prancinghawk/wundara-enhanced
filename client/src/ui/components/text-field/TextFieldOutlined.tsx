import {
    ChangeEventHandler,
    FC,
    FormEventHandler,
    ReactNode,
    useId,
} from "react";

interface TextFieldOutlinedProps {
    cols?: number;
    id?: string;
    leftElement?: ReactNode;
    name?: string;
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    onSubmit?: FormEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    rightElement?: ReactNode;
    rows?: number;
    type?: string;
    value?: string;
}

const TextFieldOutlined: FC<TextFieldOutlinedProps> = ({
    cols,
    id,
    leftElement,
    name,
    onChange,
    onSubmit,
    placeholder = "Placeholder",
    rightElement,
    rows = 4,
    type,
    value,
    ...props
}) => {
    const formId = useId();
    return (
        <div className="relative flex w-full rounded-t-[8px]">
            {leftElement && (
                <div className="absolute flex h-[56px] w-[56px] items-center justify-center">
                    <div className="text-on-surface-variant">{leftElement}</div>
                </div>
            )}
            <textarea
                id={id || formId}
                onChange={onChange}
                onSubmit={onSubmit}
                name={name}
                cols={cols}
                rows={rows}
                value={value}
                style={{boxShadow: "none"}}
                autoComplete={"off"}
                className={`
            peer
            flex
            w-full
            rounded-[8px]
            border-[1px]
            border-outline
            bg-inherit
            px-[12px]
            pr-[48px]
            pt-[26px]
            text-body-medium
            text-on-surface
            placeholder-transparent
            focus:border-outline-variant
            focus:outline-none
            sm:pt-[28px]
            ${leftElement ? "pl-[60px]" : ""}
          `}
                placeholder={placeholder}
                {...props}
            />
            <label
                htmlFor={id || formId}
                className={`
            absolute
            top-[4px]
            cursor-text
            rounded-br-[8px]
            rounded-tl-[8px]
            px-[12px]
            pb-[6px]
            pt-[6px]
            text-body-small
            text-on-surface-variant
            transition-all
            peer-placeholder-shown:top-[8px]
            peer-placeholder-shown:text-body-medium
            peer-placeholder-shown:text-on-surface-variant
            peer-focus:top-[1px]
            peer-focus:text-body-small
            peer-focus:text-on-surface-variant
            ${
                leftElement
                    ? "left-[48px] rounded-b-[8px] rounded-tl-[0px]"
                    : "left-[1px] "
            }
          )`}>
                {placeholder}
            </label>
            {rightElement && (
                <div className="absolute right-2 flex h-[56px] w-[56px] items-center justify-end text-on-surface">
                    <>{rightElement}</>
                </div>
            )}
        </div>
    );
};

export {TextFieldOutlined};
