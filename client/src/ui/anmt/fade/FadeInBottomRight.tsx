import React, {useEffect, useRef} from "react";

import {FadeInProps, useVisible} from "../../../anmt";

const FadeInBottomRight: React.FC<FadeInProps> = ({
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
            const translateY = window.innerHeight - height + scrollY;
            const transition = Math.max(
                0,
                Math.min(elementTop - translateY, maxTranslate)
            );
            const opacity = 1 - transition / maxTranslate;

            element.style.transform = `translateY(${transition}px) translateX(${transition}px)`;
            element.style.transition = `opacity ${duration}s linear, transform ${duration}s linear`;
            element.style.opacity = Math.max(
                0,
                Math.min(1, opacity)
            ).toString();
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

export {FadeInBottomRight};
