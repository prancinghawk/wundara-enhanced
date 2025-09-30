import {
    ChangeEventHandler,
    FC,
    FocusEventHandler,
    FormEventHandler,
    ReactNode,
    useId,
} from "react";

interface SearchInputProps {
    id?: string;
    leftElement?: ReactNode;
    name?: string;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onSubmit?: FormEventHandler<HTMLInputElement>;
    placeholder?: string;
    rightElement?: ReactNode;
    type?: string;
    value?: string;
}

const SearchInput: FC<SearchInputProps> = ({
    leftElement,
    name,
    onBlur,
    onChange,
    onSubmit,
    placeholder = "Search",
    rightElement,
    type,
    value,
    id,
    ...props
}: SearchInputProps) => {
    const searchInput = useId();

    return (
        <div className="relative flex w-full">
            {leftElement && (
                <div className="absolute flex h-[56px] w-[56px] items-center justify-center">
                    <div className="text-on-surface-variant">{leftElement}</div>
                </div>
            )}
            <input
                id={id || searchInput}
                onChange={onChange}
                onSubmit={onSubmit}
                name={name}
                value={value}
                type={type}
                style={{boxShadow: "none"}}
                autoComplete={"off"}
                onBlur={onBlur}
                className={`peer flex h-[56px] w-full border-0 bg-surface-container-low px-[12px] pt-[24px] text-body-medium text-on-surface placeholder-transparent focus:outline-none ${
                    leftElement ? "rounded-full pl-[56px]" : "rounded-t-[8px]"
                }`}
                placeholder={placeholder}
                {...props}
            />
            <label
                htmlFor={id || searchInput}
                className={`absolute -top-[-6px] cursor-text text-body-small text-on-surface-variant transition-all peer-placeholder-shown:top-[17px] peer-placeholder-shown:text-body-medium peer-placeholder-shown:text-on-surface-variant peer-focus:-top-[-6px] peer-focus:text-body-small peer-focus:text-on-surface-variant  ${
                    leftElement ? "left-[44px] px-[12px]" : "left-[12px]"
                }`}>
                {placeholder}
            </label>
            {rightElement && (
                <div className="absolute right-0 flex h-[56px] w-[56px] items-center justify-end px-[16px] text-on-surface">
                    <div className="flex flex-row items-center gap-[16px] text-on-surface-variant">
                        {rightElement}
                    </div>
                </div>
            )}
        </div>
    );
};

export {SearchInput};
