import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import { cn } from "../../lib/utils";

gsap.registerPlugin(useGSAP);

const RevealLoader = ({
    text = "LUMINA",
    textSize = "max(12vw, 80px)",
    textColor = "#F2F0E9",
    bgColors = ["#1A1A1A", "#2E4036"],
    angle = 0,
    staggerOrder = "left-to-right",
    movementDirection = "top-down",
    textFadeDelay = 0.5,
    className,
    onComplete,
}) => {
    const preloaderRef = useRef(null);

    const getBackgroundStyle = () => {
        if (bgColors.length === 0) return { backgroundColor: "black" };
        if (bgColors.length === 1) return { backgroundColor: bgColors[0] };
        return {
            backgroundImage: `linear-gradient(${angle}deg, ${bgColors.join(", ")})`,
        };
    };

    const getStaggerFrom = (type) => {
        switch (type) {
            case "right-to-left": return "end";
            case "center-out": return "center";
            case "edges-in": return "edges";
            case "left-to-right":
            default: return "start";
        }
    };

    const getAnimationProperties = (type) => {
        switch (type) {
            case "bottom-up":
                return { y: "-100%", ease: "power2.inOut" };
            case "fade-out":
                return { autoAlpha: 0, ease: "power2.inOut" };
            case "scale-vertical":
                return { scaleY: 0, transformOrigin: "center", ease: "power2.inOut" };
            case "top-down":
            default:
                return { y: "100%", ease: "power2.inOut" };
        }
    };

    useGSAP(
        () => {
            const tl = gsap.timeline({
                onComplete: onComplete,
            });

            const moveProps = getAnimationProperties(movementDirection);
            const staggerConfig = {
                each: 0.1,
                from: getStaggerFrom(staggerOrder),
            };

            tl.to(".name-text span", {
                y: 0,
                stagger: 0.05,
                duration: 0.2,
                ease: "power2.out",
            });

            tl.to(".preloader-item", {
                delay: 1,
                duration: 0.5,
                stagger: staggerConfig,
                ...moveProps,
            })
                .to(".name-text span", { autoAlpha: 0, duration: 0.3 }, `<${textFadeDelay}`)
                .to(preloaderRef.current, { autoAlpha: 0, duration: 0.1 }, "+=0.1", { display: "none" });
        },
        { scope: preloaderRef, dependencies: [staggerOrder, movementDirection, textFadeDelay] },
    );

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] flex overflow-hidden bg-transparent pointer-events-none",
                className,
            )}
            ref={preloaderRef}
        >
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="preloader-item h-full w-[10%] pointer-events-auto"
                    style={getBackgroundStyle()}
                ></div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="overflow-hidden">
                    <p
                        className={cn(
                            "name-text flex leading-none tracking-tight font-sans font-bold",
                        )}
                        style={{
                            fontSize: textSize,
                            color: textColor,
                            textTransform: "uppercase",
                            zIndex: 10,
                            position: "relative"
                        }}
                    >
                        {text.split("").map((char, index) => (
                            <span key={index} className="inline-block translate-y-full">
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RevealLoader;
