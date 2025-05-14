import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Timeline } from "gsap/gsap-core";
import { fetchImages } from "../services/unsplashService";

gsap.registerPlugin(ScrollTrigger);

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

        // boxes.forEach((box, index) => {
        //     gsap.fromTo(box,
        //         {
        //             zIndex: images.length - index,
        //             opacity: 0,
        //             scale: 0,
        //             rotate: 45,
        //             transformOrigin: "center center",
        //             clipPath: "circle(0% at 50% 50%)",
        //         }, // Initial state
        //         {
        //             opacity: 1,
        //             scale: 1,
        //             ease: "power2.inOut",
        //             rotate: 0,
        //             clipPath: "circle(100% at 50% 50%)",
        //             transform: "translateZ(0)", // Force GPU acceleration
        //             transformStyle: "preserve-3d",
        //             perspective: 1000,
        //             perspectiveOrigin: "50% 50%",
        //             transformOrigin: "center center",
        //             onComplete: () => {
        //                 gsap.set(box, { zIndex: 0, scale: 1 }) // Reset the scale and zIndex after animation
        //             },
        //             zIndex: images.length - index,
        //             scrollTrigger: {
        //                 trigger: containerRef.current,
        //                 start: `top+=${index * 50}px center`, // Adjust the offset for each image
        //                 end: `top+=${(index + 1) * 50}px center`,
        //                 scrub: true,
        //                 markers: true, // Debug markers
        //                 toggleActions: "play reverse play reverse", // Animates in both directions
        //             },
        //         }
        //     );
        // })

        // Create the timeline
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top center", // Start when the container hits the center of the viewport
                end: `+=${boxes.length * 100}px`, // Adjust the scroll distance for the entire sequence
                scrub: true, // Smooth scrubbing
                markers: true, // For debugging
            },
        });

        // Loop through the boxes and add animations to the timeline
        boxes.forEach((box, index) => {
            timeline.fromTo(
                box,
                {
                    zIndex: images.length - index,
                    opacity: 0,
                    scale: 0,
                    rotate: 45,
                    transformOrigin: "center center",
                    clipPath: "circle(0% at 50% 50%)",
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    clipPath: "circle(100% at 50% 50%)",
                    ease: "power2.inOut",
                    duration: 0.5, // Adjust the duration of each animation
                    onComplete: () => {
                        gsap.set(box, { zIndex: 0, scale: 1 }); // Reset the scale and zIndex after animation
                    },
                },
                index * 0.5 // Staggering effect by offsetting start time for each box
            );
        });


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