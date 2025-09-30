import {ChangeEventHandler, FC, ReactNode} from "react";

interface CheckboxProps {
    ariaLabel?: string;
    checked?: boolean;
    children?: ReactNode;
    color?: string;
    defaultChecked?: boolean;
    id?: string;
    label?: string;
    name?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    padding?: string;
    value?: string;
}

const Checkbox: FC<CheckboxProps> = ({
    ariaLabel,
    checked,
    children,
    color,
    defaultChecked,
    id,
    label,
    name,
    onChange,
    padding,
    value,
    ...props
}: CheckboxProps) => {
    return (
        <div
            className={`flex flex-row items-center gap-[4px] ${padding || ""}`}>
            <div className="flex h-[40px] w-[40px] flex-row items-center justify-center gap-8 rounded-full transition-all duration-500 hover:bg-surface-container-highest/30">
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    onChange={onChange}
                    value={value}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    aria-label={ariaLabel}
                    style={{boxShadow: "none"}}
                    className={`h-[20px] w-[20px] cursor-pointer rounded-[6px] border-0 bg-surface-container-highest transition-all duration-150 ${
                        color || "text-inverse-primary"
                    }`}
                    {...props}
                />
            </div>
            {label || children ? (
                <label className="text-body-small text-on-surface">
                    {label || children}
                </label>
            ) : null}
        </div>
    );
};

export {Checkbox};
