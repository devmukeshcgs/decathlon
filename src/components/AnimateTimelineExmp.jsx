import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { onScroll, animate, createScope, createSpring, createDraggable } from 'animejs';
import { fetchImages } from "../services/unsplashService";
import reactLogo from "../vite.svg";


const AnimateTimelineExmp = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);
    const numOfImg = 3;
    const boxRef = useRef(null);
    const containerRef = useRef(null);
    const slidesRef = useRef([]);
    const root = useRef(null);
    const scope = useRef(null);
    const [rotations, setRotations] = useState(0);

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

    useEffect(() => {

        scope.current = createScope({ root }).add(self => {

            // Every anime.js instances declared here are now scopped to <div ref={root}>

            // Created a bounce animation loop
            animate('.logo', {
                scale: [
                    { to: 1.25, ease: 'inOut(3)', duration: 200 },
                    { to: 1, ease: createSpring({ stiffness: 300 }) }
                ],
                loop: true,
                loopDelay: 250,
            });

            // Make the logo draggable around its center
            createDraggable('.logo', {
                container: [0, 0, 0, 0],
                releaseEase: createSpring({ stiffness: 200 })
            });

            // Register function methods to be used outside the useEffect
            self.add('rotateLogo', (i) => {
                animate('.logo', {
                    rotate: i * 360,
                    ease: 'out(4)',
                    duration: 1500,
                });
            });

            animate('.square', {
                x: '15rem',
                rotate: '1turn',
                duration: 2000,
                alternate: true,
                loop: false,
                easing: 'easeInOutSine',
                autoplay: onScroll({
                    container: '.scroll-container',
                    debug: true,
                })
            });

        });

        // Properly cleanup all anime.js instances declared inside the scope
        return () => scope.current.revert()

    }, []);
    useEffect(() => {

        scope.current = createScope({ root }).add(self => {

            // Every anime.js instances declared here are now scopped to <div ref={root}>
            // Created a bounce animation loop
            animate('.logo', {
                scale: [
                    { to: 1.25, ease: 'inOut(3)', duration: 200 },
                    { to: 1, ease: createSpring({ stiffness: 300 }) }
                ],
                loop: true,
                loopDelay: 250,
            });

            // Make the logo draggable around its center
            createDraggable('.logo', {
                container: [0, 0, 0, 0],
                releaseEase: createSpring({ stiffness: 200 })
            });

            // Register function methods to be used outside the useEffect
            self.add('rotateLogo', (i) => {
                animate('.logo', {
                    rotate: i * 360,
                    ease: 'out(4)',
                    duration: 1500,
                });
            });

        });

        // Properly cleanup all anime.js instances declared inside the scope
        return () => scope.current.revert()

    }, []);

    const handleClick = () => {
        setRotations(prev => {
            const newRotations = prev + 1;
            // Animate logo rotation on click using the method declared inside the scope
            scope.current.methods.rotateLogo(newRotations);
            return newRotations;
        });
    };

    return (
        <div ref={containerRef} className="bg-black" >
            <div ref={root}>
                <div className="large centered row">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </div>
                <div className="medium row">
                    <fieldset className="controls">
                        <button onClick={handleClick}>rotations: {rotations}</button>
                    </fieldset>
                </div>
                <div className="scroll-container">
                    <div className="square w-px-100 h-px-100">
                        test
                    </div>
                </div>
            </div>
            <div className=" ">
                <div className="anim-trigger flex margin-4" >
                    <div className=" ">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className=" "
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

export default AnimateTimelineExmp; 