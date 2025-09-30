import React, {useEffect, useRef} from "react";

import {SlideInProps, useVisible} from "../../../anmt";

const SlideInRight: React.FC<SlideInProps> = ({
    children,
    duration = 0.5,
    maxTranslate = 50,
    trigger = 0.5,
}) => {
    const ref = useRef<HTMLElement>(null);
    const visible = useVisible(ref);

    const handleAnimation = () => {
        const element = ref.current;

        if (element) {
            const {top, height} = element.getBoundingClientRect();
            const scrollY = window.scrollY;
            const actionPoint = height * trigger;
            const elementTop = top + scrollY - actionPoint;
            const translateX = window.innerHeight - height + scrollY;
            const transition = Math.max(
                0,
                Math.min(elementTop - translateX, maxTranslate)
            );
            element.style.transform = `translateX(${transition}px)`;
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

export {SlideInRight};
