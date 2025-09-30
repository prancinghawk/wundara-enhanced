import React, {useEffect, useId} from "react";

const PerspectiveImage = ({children}: any) => {
    const id = useId();

    useEffect(() => {
        const ticketElm = document.getElementById(id);

        if (ticketElm) {
            const {x, y, width, height} = ticketElm.getBoundingClientRect();
            const centerPoint = {x: x + width / 2, y: y + height / 2};

            const handleMouseMove = (e: MouseEvent) => {
                const degreeX = (e.clientY - centerPoint.y) * -0.03;
                const degreeY = (e.clientX - centerPoint.x) * 0.03;

                ticketElm.style.transform = `perspective(800px) rotateX(${degreeX}deg) rotateY(${degreeY}deg)`;
            };

            // Add event listener only once
            window.addEventListener("mousemove", handleMouseMove);

            return () => {
                // Remove the event listener when the component unmounts
                window.removeEventListener("mousemove", handleMouseMove);
            };
        }
    }, []);

    return <div id={id}>{children}</div>;
};

export {PerspectiveImage};
