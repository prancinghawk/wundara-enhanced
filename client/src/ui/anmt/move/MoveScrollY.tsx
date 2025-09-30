import React, {useEffect, useRef} from "react";

import {MoveProps, useVisible} from "../../../anmt";

const MoveScrollY: React.FC<MoveProps> = ({
    children,
    radius = 20,
    duration = 0.5,
    reverse,
}) => {
    const ref = useRef<HTMLElement>(null);
    const visible = useVisible(ref);

    const handleAnimation = () => {
        const element = ref.current;

        if (element) {
            const {top} = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const centerY = windowHeight / 2;
            const offsetY = ((centerY - top) / centerY) * (radius / 2);

            element.style.transform = `translate(0px, ${
                reverse ? -offsetY : offsetY
            }px)`;
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
    }, [visible, duration, radius]);

    return React.cloneElement(
        React.Children.only(children) as React.ReactElement,
        {
            ref,
        }
    );
};

export {MoveScrollY};
