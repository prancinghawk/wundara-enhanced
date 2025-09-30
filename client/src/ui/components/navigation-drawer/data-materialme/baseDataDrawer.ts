interface BaseDataDrawerItem {
    id: string;
    label: string;
    url: string;
    badge?: boolean;
    badgeText?: string;
}

const baseDataDrawer: BaseDataDrawerItem[] = [
    {
        id: "1",
        label: "Typography",
        url: "/typography",
        badge: false,
    },
    {
        id: "2",
        label: "Palette",
        url: "/palette",
        badge: true,
    },
    {
        id: "3",
        label: "Elevations",
        url: "/elevations",
        badge: false,
    },
    {
        id: "4",
        label: "Shape",
        url: "/shape",
        badge: false,
    },
];

export {baseDataDrawer};
