import React, {useEffect, useRef} from "react";

import {MoveProps, useVisible} from "../../../anmt";

const MoveMouse: React.FC<MoveProps> = ({
    children,
    radius = 10,
    duration = 0.2,
}) => {
    const ref = useRef<HTMLElement>(null);
    const visible = useVisible(ref);

    const handleAnimation = (e: MouseEvent) => {
        const element = ref.current;

        if (element && e) {
            const {clientX, clientY} = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = ((clientX - centerX) / centerX) * radius;
            const offsetY = ((clientY - centerY) / centerY) * radius;

            element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            element.style.transition = `transform ${duration}s linear`;
        }
    };

    const requestAnimation = (e: MouseEvent) => {
        requestAnimationFrame(() => handleAnimation(e));
    };

    useEffect(() => {
        if (visible) {
            window.addEventListener("mousemove", requestAnimation);
            return () => {
                window.removeEventListener("mousemove", requestAnimation);
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

export {MoveMouse};
