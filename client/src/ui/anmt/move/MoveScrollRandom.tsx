import React, {useEffect, useRef} from "react";

import {MoveProps, debounce, useVisible} from "../../../anmt";

const MoveScrollRandom: React.FC<MoveProps> = ({
    children,
    radius = 20,
    duration = 1,
}) => {
    const ref = useRef<HTMLElement>(null);
    const visible = useVisible(ref);

    const handleAnimation = () => {
        const element = ref.current;

        if (element) {
            const offsetX = getRandomValueInRadius(radius);
            const offsetY = getRandomValueInRadius(radius);

            element.style.transition = `transform ${duration}s ease-in-out`;
            element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
    };

    const getRandomValueInRadius = (radius: number) => {
        return Math.random() * radius - radius / 2;
    };

    const debouncedAnimation = debounce(handleAnimation, 100);

    const requestAnimation = () => {
        requestAnimationFrame(debouncedAnimation);
    };

    useEffect(() => {
        if (visible) {
            requestAnimation();
            window.addEventListener("scroll", requestAnimation);
            return () => {
                window.removeEventListener("scroll", requestAnimation);
            };
        }
    }, [visible]);

    return React.cloneElement(
        React.Children.only(children) as React.ReactElement,
        {
            ref,
        }
    );
};

export {MoveScrollRandom};
