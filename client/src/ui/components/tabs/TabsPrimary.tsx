import {FC, ReactNode, useState} from "react";

interface TabsProps {
    id?: number | string;
    icon?: ReactNode;
    header?: string;
    content?: ReactNode;
}

interface TabsPrimaryProps {
    tabs: TabsProps[];
}

const TabsPrimary: FC<TabsPrimaryProps> = ({tabs = []}) => {
    const [selectedId, setSelectedId] = useState(tabs[0].id);
    const selectedTab = tabs.find((tab) => tab.id === selectedId);
    return (
        <div className="flex h-fit w-full flex-col">
            <div className="flex flex-row items-end overflow-x-auto border-b border-outline scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedId(tab.id)}
                        className={`relative flex ${
                            tab.icon ? "h-[64px]" : "h-[48px]"
                        } w-full min-w-[80px] flex-auto flex-col items-center justify-center px-[16px] text-center text-label-large transition-all sm:min-w-max ${
                            tab.id === selectedId
                                ? `${
                                      tab.icon ? "pt-[18px]" : "pt-[0px]"
                                  } text-primary hover:bg-surface-container`
                                : `${
                                      tab.icon ? "pt-[18px]" : "pt-[6px]"
                                  } text-on-surface-variant hover:bg-surface-container`
                        }`}>
                        {tab.icon && (
                            <div
                                className={`${
                                    tab.header
                                        ? "absolute top-[4px] flex"
                                        : "absolute top-[16px] flex"
                                }`}>
                                {tab.icon}
                            </div>
                        )}
                        {tab.header}
                        {tab.id === selectedId && (
                            <div className="absolute bottom-0 flex h-[4px] w-1/3 rounded-t-[3px] bg-primary"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex w-full flex-col gap-[16px] p-[16px] text-body-medium text-on-surface">
                {selectedTab ? selectedTab.content : undefined}
            </div>
        </div>
    );
};

export {TabsPrimary};
