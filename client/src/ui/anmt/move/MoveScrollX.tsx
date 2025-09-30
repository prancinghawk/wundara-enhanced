import React, {useEffect, useRef} from "react";

import {MoveProps, useVisible} from "../../../anmt";

const MoveScrollX: React.FC<MoveProps> = ({
    children,
    radius = 20,
    duration = 1,
    reverse,
}) => {
    const ref = useRef<HTMLElement>(null);
    const visible = useVisible(ref);

    const handleAnimation = () => {
        const element = ref.current;

        if (element) {
            const {top} = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const centerX = windowHeight / 2;
            const offsetX = ((centerX - top) / centerX) * (radius / 2);

            element.style.transform = `translate(${
                reverse ? -offsetX : offsetX
            }px, 0px)`;
            element.style.transition = `transform ${duration}s linear`;
        }
    };

    const requestAnimation = () => {
        requestAnimationFrame(handleAnimation);
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

export {MoveScrollX};
