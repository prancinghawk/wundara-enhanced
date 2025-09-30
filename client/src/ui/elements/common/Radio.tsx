import {ChangeEventHandler, FC, ReactNode} from "react";

interface RadioProps {
    ariaLabel?: string;
    checked?: boolean;
    children?: ReactNode;
    color?: string;
    defaultChecked?: boolean;
    id?: string;
    label?: string;
    name?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value?: string;
}

const Radio: FC<RadioProps> = ({
    ariaLabel,
    checked,
    children,
    color = "text-on-surface-variant",
    defaultChecked,
    id,
    label,
    name,
    onChange,
    value,
    ...props
}: RadioProps) => {
    return (
        <div className="flex flex-row items-center gap-[4px]">
            <label className="flex h-[40px] w-[40px] items-center justify-center rounded-full transition-all duration-500 hover:bg-surface-container-highest/30">
                <input
                    type="radio"
                    id={id}
                    name={name}
                    onChange={onChange}
                    value={value}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    aria-label={ariaLabel}
                    style={{boxShadow: "none"}}
                    className={`form-radio h-[20px] w-[20px] cursor-pointer appearance-none rounded-full border-none bg-surface-container-low text-secondary-container checked:text-inverse-primary ${color}`}
                    {...props}
                />
            </label>
            {label || children ? (
                <label className="text-body-small text-on-surface">
                    {label || children}
                </label>
            ) : null}
        </div>
    );
};

export {Radio};
