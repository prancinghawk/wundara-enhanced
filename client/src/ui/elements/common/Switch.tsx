import {ChangeEventHandler, useId, useState} from "react";

interface SwitchProps {
    ariaLabel?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    label?: string;
    name?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    readOnly?: boolean;
    value?: string;
}

const Switch = ({
    ariaLabel,
    checked,
    defaultChecked,
    label,
    name,
    onChange,
    readOnly,
    value,
    ...props
}: SwitchProps) => {
    const [enabled, setEnabled] = useState(false);
    const switchId = useId();

    return (
        <label className="relative flex w-fit items-center">
            <input
                type="checkbox"
                className="peer sr-only"
                id={switchId}
                name={name}
                value={value}
                aria-label={ariaLabel}
                checked={enabled}
                defaultChecked={defaultChecked}
                onChange={onChange}
                readOnly={readOnly}
                {...props}
            />
            <div
                onClick={() => {
                    setEnabled(!enabled);
                }}
                className="h-[32px] w-[52px] cursor-pointer rounded-full bg-surface-container-highest after:absolute after:left-[8px] after:top-[8px] after:h-[16px] after:w-[16px] after:rounded-full after:bg-white after:ring-on-surface/10 after:transition-all hover:after:ring-[12px] focus:after:ring-[16px] peer-checked:bg-inverse-primary peer-checked:after:translate-x-[20px]"></div>
        </label>
    );
};

Switch.propTypes = {};

export {Switch};
