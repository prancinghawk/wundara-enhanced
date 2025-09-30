import {FC, useEffect, useState} from "react";

import {IconButton} from "../button/icon-button/IconButton";
import {OverflowMenu} from "../overflow-menu/OverflowMenu";
import {cn} from "../../utils/utils";
import {useTheme} from "next-themes";
import {MdPalette} from "react-icons/md";

interface ToggleThemeProps {
    className?: string;
    label?: boolean;
}

const ToggleThemeMenu: FC<ToggleThemeProps> = ({
    label,
    className,
}: ToggleThemeProps) => {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderThemeChanger = () => {
        if (!mounted) return null;

        return (
            <div
                className={cn(
                    `flex w-full flex-row items-center justify-between ${
                        className || ""
                    }`
                )}>
                {label && (
                    <p className="flex text-body-medium capitalize">
                        {theme} theme
                    </p>
                )}
                <OverflowMenu
                    bottomRight
                    menu={
                        <>
                            <OverflowMenu.Item
                                onClick={() => setTheme("light")}
                                label={"Light"}
                            />
                            <OverflowMenu.Item
                                onClick={() => setTheme("dark")}
                                label={"Zinc"}
                            />
                            <OverflowMenu.Item
                                onClick={() => setTheme("slate")}
                                label={"Slate"}
                            />
                            <OverflowMenu.Item
                                onClick={() => setTheme("neutral")}
                                label={"Neutral"}
                            />
                        </>
                    }>
                    <IconButton
                        icon={<MdPalette size={24} />}
                        variant="tonal"
                    />
                </OverflowMenu>
            </div>
        );
    };

    return <>{renderThemeChanger()}</>;
};

export default ToggleThemeMenu;
