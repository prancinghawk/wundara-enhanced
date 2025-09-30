import {RefObject, useEffect, useState} from "react";

export const useVisible = (ref: RefObject<HTMLElement | null>): boolean => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            setVisible(() => entry.isIntersecting);
        };

        if (element) {
            const observer = new IntersectionObserver(handleIntersection, {
                root: null,
                rootMargin: "0px 0px 600px 0px",
                threshold: 0,
            });

            observer.observe(element);

            return () => {
                observer.disconnect();
            };
        }
    }, [ref]);

    return visible;
};
