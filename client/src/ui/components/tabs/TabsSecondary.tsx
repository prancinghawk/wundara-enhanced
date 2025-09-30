import {FC, ReactNode, useState} from "react";

interface TabsProps {
    id?: number | string;
    header?: string;
    content?: ReactNode;
}

interface TabsSecondaryProps {
    tabs: TabsProps[];
}

const TabsSecondary: FC<TabsSecondaryProps> = ({tabs = []}) => {
    const [selectedId, setSelectedId] = useState(tabs[0].id);
    const selectedTab = tabs.find((tab) => tab.id === selectedId);
    return (
        <div className="flex w-full flex-col">
            <div className="flex h-[48px] flex-row overflow-x-auto border-b border-outline scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedId(tab.id)}
                        className={`flex h-[48px] w-full min-w-[100px] flex-auto items-center justify-center px-[16px] text-center text-label-large sm:min-w-max ${
                            tab.id === selectedId
                                ? "border-b-[2px] border-primary pt-[2px]  text-on-surface hover:bg-surface-container"
                                : "text-on-surface-variant hover:bg-surface-container"
                        }`}>
                        {tab.header}
                    </button>
                ))}
            </div>

            <div className="flex w-full flex-col gap-[16px] p-[16px] text-body-medium text-on-surface">
                {selectedTab ? selectedTab.content : undefined}
            </div>
        </div>
    );
};

export {TabsSecondary};
