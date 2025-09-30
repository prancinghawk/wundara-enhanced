import {FC, MouseEventHandler, useState} from "react";

import {IconButton} from "../../components/button/icon-button/IconButton";
import {MdAdd, MdRemove} from "react-icons/md";

interface AmountProps {
    amount?: number;
    minusAmount?: MouseEventHandler<HTMLButtonElement>;
    plusAmount?: MouseEventHandler<HTMLButtonElement>;
}

const Amount: FC<AmountProps> = ({}: AmountProps) => {
    const [amount, setAmount] = useState(1);

    function minusAmount() {
        setAmount(amount - 1);
    }

    function plusAmount() {
        setAmount(amount + 1);
    }

    return (
        <div className="flex w-fit flex-row gap-[4px] rounded-[8px] bg-surface-container-high">
            <IconButton
                icon={<MdRemove size={18} />}
                variant={"standard"}
                className={"m-[2px] rounded-[6px] p-[6px] "}
                onClick={minusAmount}
                disabled={amount === 0}
            />
            <div className="flex min-w-[24px] items-center justify-center px-[2px] text-body-medium text-on-surface">
                {amount}
            </div>
            <IconButton
                icon={<MdAdd size={18} />}
                variant={"standard"}
                className={"m-[2px] rounded-[6px] p-[6px]"}
                onClick={plusAmount}
            />
        </div>
    );
};

export {Amount};
