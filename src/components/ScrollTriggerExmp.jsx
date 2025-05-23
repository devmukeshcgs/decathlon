import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Timeline } from "gsap/gsap-core";
import { fetchImages } from "../services/unsplashService";

gsap.registerPlugin(ScrollTrigger);

const ScrollTriggerExmp = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);
    const numOfImg = 3;
    const boxRef = useRef(null);
    const containerRef = useRef(null);
    const slidesRef = useRef([]);



    useEffect(() => {
        if (images.length === 0 || isLoading) return;

        // Set initial clip-path for all slides except the first
        slidesRef.current.forEach((slide, index) => {
            gsap.set(slide, { scale: 0.5 });
        });
    }, [images, isLoading]);

    useGSAP(() => {
        const boxes = containerRef.current.querySelectorAll('.img'); // Select all .box elements
        gsap.set(boxes[0], {
            opacity: 1,
            scale: 1,
            rotate: 45,
        }); // Set the first box to be visible

        boxes.forEach((box, index) => {
            gsap.fromTo(box,
                {
                    zIndex: images.length - index,
                    opacity: 0,
                    scale: 0,
                    rotate: 45,
                    transformOrigin: "center center",
                    clipPath: "circle(0% at 50% 50%)",
                }, // Initial state
                {
                    opacity: 1,
                    scale: 1,
                    ease: "power2.inOut",
                    rotate: 0,
                    clipPath: "circle(100% at 50% 50%)",
                    transform: "translateZ(0)", // Force GPU acceleration
                    transformStyle: "preserve-3d",
                    perspective: 1000,
                    perspectiveOrigin: "50% 50%",
                    transformOrigin: "center center",
                    onComplete: () => {
                        gsap.set(box, { zIndex: 0, scale: 1 }) // Reset the scale and zIndex after animation
                    },
                    zIndex: images.length - index,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: `top+=${index * 150}px center`, // Adjust the offset for each image
                        end: `top+=${(index + 1) * 150}px center`,
                        scrub: true,
                        markers: true, // Debug markers
                        toggleActions: "play reverse play reverse", // Animates in both directions
                    },
                }
            );
        })
    });

    return (
        <div ref={containerRef} className="bg-black" >
            <div className="relative"  >
                <div className="gsap-trigger" >
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className="img"
                            style={{
                                backgroundImage: `url(${image.thumbUrl})`,
                            }}
                        >
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScrollTriggerExmp; 