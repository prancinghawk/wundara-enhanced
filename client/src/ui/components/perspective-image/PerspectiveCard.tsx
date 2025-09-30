import React, {useEffect, useRef} from "react";

const PerspectiveCard = ({children}: any) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const containerElm = containerRef.current;

        if (containerElm) {
            const {width, height} = containerElm.getBoundingClientRect();
            const centerPoint = {x: width / 2, y: height / 2};

            const handleMouseMove = (e: MouseEvent) => {
                const containerRect = containerElm.getBoundingClientRect();
                const mouseX = e.clientX - containerRect.left;
                const mouseY = e.clientY - containerRect.top;

                const degreeX = (mouseY - centerPoint.y) * -0.025;
                const degreeY = (mouseX - centerPoint.x) * 0.025;

                containerElm.style.transform = `perspective(800px) rotateX(${degreeX}deg) rotateY(${degreeY}deg)`;
            };

            const handleMouseLeave = () => {
                containerElm.style.transform =
                    "perspective(800px) rotateX(0deg) rotateY(0deg)";
            };

            containerElm.addEventListener("mousemove", handleMouseMove);
            containerElm.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                containerElm.removeEventListener("mousemove", handleMouseMove);
                containerElm.removeEventListener(
                    "mouseleave",
                    handleMouseLeave
                );
            };
        }
    }, []);

    return (
        <span
            className="transition-all duration-100"
            ref={containerRef}
            style={{perspective: "0px"}}>
            {children}
        </span>
    );
};

export {PerspectiveCard};
