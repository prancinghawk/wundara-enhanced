export const setCategoryColors = (
    categories: string[],
    colors: Color[] | undefined
): Map<string, Color> => {
    const categoryColors = new Map<string, Color>();
    categories.forEach((category, index) => {
        if (colors) {
            categoryColors.set(category, colors[index]);
        }
    });
    return categoryColors;
};

export type Color = (typeof colorValues)[number];

export const colorValues = [
    "#3B82F6",
    "#14B8A6",
    "#A855F7",
    "#6366F1",
    "#EAB308",
    "#0EA5E9",
    "#F97316",
    "#8B5CF6",
    "#F43F5E",
];
