import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Timeline } from "gsap/gsap-core";
import { fetchImages } from "../services/unsplashService";
import { GSDevTools } from "gsap/GSDevTools";

gsap.registerPlugin(ScrollTrigger, GSDevTools)


const TimelineExmp = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);
    const numOfImg = 3;
    const boxRef = useRef(null);
    const containerRef = useRef(null);
    const slidesRef = useRef([]);

    // Fetch images
    useEffect(() => {
        const loadImages = async () => {
            try {
                setIsLoading(true);
                const fetchedImages = await fetchImages(numOfImg);
                setImages(fetchedImages);
            } catch (error) {
                console.error('Error loading images:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadImages();
    }, []);

    useEffect(() => {
        if (images.length === 0 || isLoading) return;

        // Set initial clip-path for all slides except the first
        slidesRef.current.forEach((slide, index) => {
            // gsap.set(slide, { scale: 0.5 });
        });
    }, [images, isLoading]);

    useGSAP(() => {
        // GSDevTools.create();
        const boxes = containerRef.current.querySelectorAll('.img'); // Select all .box elements
        const boxWrapper = containerRef.current.querySelectorAll('.imgInner'); // Select all .box elements
        gsap.set(boxes[0], {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transformOrigin: "center center",
        }); // Set the first box to be visible


        // Create the timeline
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: `+=${boxes.length * 150}px`,
                scrub: 1,
                markers: true,
            },
        });

        // Loop through the boxes and add animations to the timeline
        boxWrapper.forEach((box, index) => {
            if (index === 0) {
                gsap.set(box, { zIndex: 0, scale: 1 });
            }
            let zIndex = images.length - index;
            timeline.fromTo(
                box,
                {
                    zIndex: zIndex,
                    opacity: 0,
                    scale: 0,
                    rotate: 20,
                    transformOrigin: "center center",
                    borderRadius: "10px",
                },
                {
                    zIndex: zIndex + 1,
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    transformOrigin: "center center",
                    ease: "power2.inOut",
                    borderRadius: "20px",

                    duration: 0.5,
                    onComplete: () => {
                        // gsap.set(box, { zIndex: 0, scale: 1 });
                        gsap.set(box, { zIndex: 0 });
                    },
                },
                index * 0.5
            );
        });
    });

    return (
        <div ref={containerRef} className="bg-black" >
            <div className="relative">
                <div className="gsap-trigger flex margin-4" >
                    <div className="imgWrapper">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className="imgInner"
                            // style={{
                            //     backgroundColor: index === 0 ? "black" : index === 2 ? "red" : "blue",
                            // }}
                            >
                                <div
                                    ref={(el) => (slidesRef.current[index] = el)}
                                    className="img"
                                    style={{
                                        backgroundImage: `url(${image.thumbUrl})`,
                                    }}
                                >
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineExmp;
{/* <div
    key={image.id}
    className="img"
    style={{
        backgroundImage: `url(${image.thumbUrl})`,
    }}
>
<img
                            key={image.id}
                            className="img"
                            src={image.thumbUrl}
                            alt={`Image ${index}`}
                        />
</div> */}