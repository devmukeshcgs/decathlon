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
        gsap.set(boxes[0], { opacity: 1 })

        boxes.forEach((box, index) => {
            gsap.fromTo(box,
                { zIndex: images.length - index, opacity: 0 }, // Initial state
                {
                    opacity: 1,
                    zIndex: images.length - index,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: `top+=${index * 100}px center`, // Adjust the offset for each image
                        end: `top+=${(index + 1) * 100}px center`,
                        scrub: true,
                        markers: true, // Debug markers
                        toggleActions: "play reverse play reverse", // Animates in both directions
                    },
                    onComplete: () => {
                        gsap.to(box,
                            {
                                opacity: 0
                            })
                    }
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