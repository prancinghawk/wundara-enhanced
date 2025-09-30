import React, {useEffect, useRef, useState} from "react";

import {TiltProps, useVisible} from "../../../anmt";

const TiltScaleBottom = ({
    children,
    duration = 0.2,
    offset = 0.06,
    perspective = 2000,
    distanceTop = 100,
}: TiltProps) => {
    const ref = useRef<HTMLElement>(null);
    const [tiltActive, setTiltActive] = useState(true);
    const visible = useVisible(ref);

    const handleAnimation = () => {
        const element = ref.current;

        if (element) {
            const scrollY = window.scrollY;
            const top =
                element.getBoundingClientRect().top + scrollY - distanceTop;
            top >= scrollY ? setTiltActive(true) : setTiltActive(false);

            const degreeX = tiltActive ? (scrollY - top) * -offset : 0;
            const scale = tiltActive
                ? 70 + (100 - 70) * (1 - Math.abs(degreeX) / 90)
                : 100;

            element.style.transition = `transform ${duration}s linear, opacity ${
                duration === 0 ? 1 : 2
            }s ease-in-out`;
            element.style.transform = `perspective(${perspective}px) rotateX(${degreeX}deg) scale(${
                scale / 100
            })`;
            element.style.opacity = "1";
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
    }, [tiltActive, visible]);

    return React.cloneElement(
        React.Children.only(children) as React.ReactElement,
        {
            ref,
            style: {
                opacity: "0",
            },
        }
    );
};

export {TiltScaleBottom};
