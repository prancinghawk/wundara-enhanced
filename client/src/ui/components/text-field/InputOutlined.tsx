import {
    ChangeEventHandler,
    FC,
    FormEventHandler,
    ReactNode,
    useId,
} from "react";

interface InputOutlinedProps {
    id?: string;
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

const InputOutlined: FC<InputOutlinedProps> = ({
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
}: InputOutlinedProps) => {
    const formId = useId();
    return (
        <div className={`relative flex w-full rounded-t-[8px]`}>
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
                style={{boxShadow: "none"}}
                type={type || "text"}
                autoComplete={"off"}
                className={`
          peer
          flex
          h-full
          w-full
          rounded-[8px]
          border-[1px]
          border-outline
          bg-inherit
          px-[12px]
          pt-[24px]
          text-body-medium
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
                <div className="absolute right-2 flex h-[56px] w-fit items-center justify-end text-on-surface">
                    <>{rightElement}</>
                </div>
            )}
        </div>
    );
};

export {InputOutlined};
