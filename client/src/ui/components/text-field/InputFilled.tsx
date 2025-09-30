import {
    ChangeEventHandler,
    FC,
    FormEventHandler,
    ReactNode,
    useId,
} from "react";

interface InputFilledProps {
    id?: string;
    cols?: number;
    leftElement?: ReactNode;
    name?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onSubmit?: FormEventHandler<HTMLInputElement>;
    placeholder?: string;
    rightElement?: ReactNode;
    rows?: number;
    type?: string;
    value?: string;
}

const InputFilled: FC<InputFilledProps> = ({
    id,
    leftElement,
    name,
    onChange,
    onSubmit,
    placeholder = "Placeholder",
    rightElement,
    rows,
    type,
    value,
    ...props
}: InputFilledProps) => {
    const formId = useId();

    return (
        <div className="relative flex w-full rounded-t-[8px]">
            {leftElement && (
                <div className="absolute flex h-[56px] w-[56px] items-center justify-center">
                    <div className="text-on-surface-variant">{leftElement}</div>
                </div>
            )}
            <input
                id={id || formId}
                onChange={onChange}
                onSubmit={onSubmit}
                name={name}
                value={value}
                style={{boxShadow: "none"}}
                type={type || "text"}
                autoComplete={"off"}
                className={`
          peer
          flex
          h-[56px]
          w-full
          rounded-t-[8px]
          border-x-0
          border-b-2
          border-t-0
          border-on-surface-variant
          bg-surface-container
          px-[12px]
          pt-[24px]
          text-body-small
          text-on-surface
          placeholder-transparent
          focus:border-primary
          focus:outline-none
          ${leftElement ? "pl-[60px]" : ""}
        `}
                placeholder={placeholder}
                {...props}
            />
            <label
                htmlFor={id || formId}
                className={`
          pointer-events-none
          absolute
          -top-[-6px]
          cursor-text
          text-body-small
          text-on-surface-variant
          transition-all
          peer-placeholder-shown:top-[17px]
          peer-placeholder-shown:text-body-medium
          peer-placeholder-shown:text-on-surface-variant
          peer-focus:-top-[-6px]
          peer-focus:text-body-small
          peer-focus:text-on-surface-variant
          ${leftElement ? "left-[48px] px-[12px]" : "left-[12px]"}
        `}>
                {placeholder}
            </label>
            {rightElement && (
                <div
                    className="
        absolute
        right-[8px]
        flex
        h-[56px]
        w-[56px]
        items-center
        justify-end
        text-on-surface">
                    <>{rightElement}</>
                </div>
            )}
        </div>
    );
};

InputFilled.propTypes = {};

export {InputFilled};
