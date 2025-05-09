import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { fetchImages } from '../services/unsplashService';

const FullScreenSlider = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showThumbnails, setShowThumbnails] = useState(true);
    const sliderRef = useRef(null);
    const slidesRef = useRef([]);
    const thumbnailsRef = useRef([]);
    const numRef = useRef([]);
    const titleRef = useRef([]);
    const thumbnailsContainerRef = useRef(null);
    const numOfImg = 8;

    // Initialize GSAP animations
    const { contextSafe } = useGSAP(() => {
        if (images.length === 0 || isLoading) return;

        // Set initial clip-path for all slides except the first
        slidesRef.current.forEach((slide, index) => {
            if (slide) {
                if (index === 0) {
                    gsap.set(slide, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', scale: 1 });
                } else {
                    gsap.set(slide, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', scale: 1.1 });
                }
            }
        });

        // Set initial thumbnail styles
        thumbnailsRef.current.forEach((thumb, index) => {
            if (thumb) {
                gsap.set(thumb, {
                    // scale: index === currentIndex ? 1.1 : 0.9,
                    opacity: index === currentIndex ? 1 : 0.8,
                    // filter: index === currentIndex ? 'none' : 'brightness(0.7)'
                });
            }
        });
    }, [images, isLoading]);

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

    // Animate to specific slide
    const goToSlide = contextSafe((index) => {
        if (index === currentIndex || index < 0 || index >= images.length) return;

        const direction = index > currentIndex ? 'next' : 'prev';
        const currentSlide = slidesRef.current[currentIndex];
        const nextSlide = slidesRef.current[index];

        if (!currentSlide || !nextSlide) return;

        const tl = gsap.timeline();
        const duration = 0.8;

        // Animate current slide out
        tl.to(currentSlide, {
            clipPath: direction === 'next'
                ? 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)'
                : 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            duration: duration,
            // x: direction === 'next' ? 0 : 10,
            scale: direction === 'next' ? 1 : 1.1,
            ease: 'power2.inOut',
            onComplete: () => {
                console.log("CURRENT SLIDE", index);
            }
        });

        // Animate next slide in
        // slide down n reveal the next slide
        tl.to(nextSlide, {
            clipPath: direction === 'next'
                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: duration,
            // x: direction === 'next' ? 10 : 0,
            scale: direction === 'next' ? 1.15 : 1,
            ease: 'power2.inOut',
            onComplete: () => {
                console.log("NEXT SLIDE", index);
                setCurrentIndex(index);
            }
        }, `-=${duration}`);

        // Animate number counter
        const t2 = gsap.timeline();
        t2.to('.num-c', {
            duration: 0.8,
            y: -(index * 25),
            ease: 'power2.inOut'
        }).to('.title-c', {
            duration: 0.8,
            y: 0,
            ease: 'power2.inOut'
        });

        // Animate thumbnails
        thumbnailsRef.current.forEach((thumb, i) => {
            gsap.to(thumb, {
                // scale: i === index ? 1.1 : 0.9,
                opacity: i === index ? 1 : 0.6,
                filter: i === index ? 'none' : 'brightness(0.7)',
                duration: 0.6,
                ease: 'power2.inOut'
            });
        });
    });

    const goNext = () => {
        if (currentIndex < images.length - 1) {
            goToSlide((currentIndex + 1) % images.length);
        }
        return;

    }
    const goPrev = () => {
        if (currentIndex >= 0) {
            // goToSlide((currentIndex - 1 + images.length) % images.length);
            goToSlide((currentIndex - 1) % images.length);
        }
        return;
    }

    if (isLoading) {
        return <div className="slider-loading">Loading images...</div>;
    }

    if (images.length === 0) {
        return <div className="slider-error">No images available</div>;
    }

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-black">
            {/* Main slider controls */}
            <div ref={numRef} className="absolute top-0 left-0 w-screen h-screen z-10">

                <button className="prev h-screen w-[50%] absolute top-0 left-0 text-white text-4xl font-semibold z-2" onClick={goPrev}>
                    +
                </button>
                <button className="next h-screen w-[50%] absolute top-0 right-0 text-white text-4xl font-semibold z-2" onClick={goNext}>
                    +
                </button>
                <div className="flex p-4 justify-center flex-row items-center gap-0 absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                    <div className='w-[25px] h-[25px] overflow-hidden'>
                        <div className='num-c'>
                            {images.map((_, index) => (
                                <div key={index} className='flex justify-center items-center w-[25px] h-[25px] overflow-hidden'>
                                    <span>{index + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <span className='text-white font-semibold w-[25px] h-[25px]'>| {images.length}</span>
                </div>
                {/* <button
                    className="absolute bottom-8 right-8 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full"
                    onClick={toggleThumbnails}
                >
                    {showThumbnails ? 'Hide' : 'Show'} Thumbnails
                </button> */}
            </div>
            {/* Main Title */}
            <div
                ref={titleRef}
                className="absolute bottom-2 h-[50px] right-0 w-full z-20"
            >
                <div className="flex p-4 justify-center flex-row items-center gap-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className='w-[400px] h-[125px] overflow-hidden'>
                        <div className='title-c'>
                            {images.map((_, index) => (
                                <div key={index} className='flex justify-center items-center w-[400px] h-[125px] overflow-hidden'>
                                    <span>{_.alt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main slides */}
            <div className="full-screen z-20" ref={sliderRef}>
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="slide absolute top-0 left-0 w-full h-full"
                        ref={el => (slidesRef.current[index] = el)}
                    >
                        <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Thumbnails */}
            <div
                ref={thumbnailsContainerRef}
                className="absolute bottom-2 h-[50px] right-0 w-full z-20 "
            >
                <div className="flex h-full items-center justify-end  ">
                    {images.map((image, index) => (
                        <div
                            key={`thumb-${image.id}`}
                            ref={el => (thumbnailsRef.current[index] = el)}
                            className="relative h-[50px] w-[80px] flex-shrink-0 cursor-pointer transition-all overflow-hidden"
                            onClick={() => goToSlide(index)}
                        >
                            <img
                                src={image.thumbUrl || image.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default FullScreenSlider;