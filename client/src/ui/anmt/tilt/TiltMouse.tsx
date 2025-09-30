import React, {useEffect, useRef} from "react";

import {TiltMouseProps, useVisible} from "../../../anmt";

const TiltMouse: React.FC<TiltMouseProps> = ({
    children,
    perspective = 800,
    duration = 0.5,
}) => {
    const ref = useRef<HTMLElement | null>(null);
    const visible = useVisible(ref);

    const handleAnimation = (e: MouseEvent) => {
        const element = ref.current;

        if (element && e) {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            const centerScreen = {
                x: screenWidth / 2 + scrollX,
                y: screenHeight / 2 + scrollY,
            };

            const degreeX = (e.clientY + scrollY - centerScreen.y) * -0.04;
            const degreeY = (e.clientX + scrollX - centerScreen.x) * 0.03;

            element.style.perspective = `perspective(${perspective}px)`;
            element.style.transform = `rotateX(${degreeX}deg) rotateY(${degreeY}deg)`;
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

export {TiltMouse};
