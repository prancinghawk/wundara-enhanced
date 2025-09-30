interface TextElementProps {
    body?: string;
    bodyStyle?: string;
    label?: string;
    labelStyle?: string;
    title?: string;
    titleStyle?: string;
}

function TextElement({
    body,
    bodyStyle,
    label,
    labelStyle,
    title,
    titleStyle,
}: TextElementProps) {
    return (
        <div className="flex flex-col items-start justify-center pb-[4px] text-on-surface">
            {label && (
                <p
                    className={`flex text-label-medium font-semibold text-on-surface-variant ${
                        labelStyle || ""
                    }`}>
                    {label}
                </p>
            )}

            {title && (
                <h2
                    className={`flex text-title-medium font-semibold ${
                        titleStyle || ""
                    }`}>
                    {title}
                </h2>
            )}

            {body && (
                <p
                    className={`text-body-medium text-on-surface-variant ${
                        bodyStyle || ""
                    }`}>
                    {body}
                </p>
            )}
        </div>
    );
}

export {TextElement};
