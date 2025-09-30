import React, {useEffect, useRef} from "react";

import {FadeInProps, useVisible} from "../../../anmt";

const FadeIn: React.FC<FadeInProps> = ({
    children,
    duration = 0.5,
    maxTranslate = 50,
    trigger = 0.2,
}: FadeInProps) => {
    const ref = useRef<HTMLElement>(null);
    const visible = useVisible(ref);

    const handleAnimation = () => {
        const element = ref.current;

        if (element) {
            const {top} = element.getBoundingClientRect();
            const actionPoint = element.offsetHeight * trigger;
            const elementTop = top + window.scrollY - actionPoint;
            const translateX =
                window.innerHeight - ref.current.offsetHeight + window.scrollY;
            const transition = Math.max(
                0,
                Math.min(elementTop - translateX, maxTranslate)
            );
            const opacity = 1 - transition / maxTranslate;

            element.style.transition = `opacity ${duration}s linear`;
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

export {FadeIn};
