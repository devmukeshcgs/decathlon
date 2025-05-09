import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
const ststicImg = [
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1743485237407-e00bfb75163e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'Image 1',
        alt: 'Description 1'
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1744429523595-2c06b8611242?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'Image 2',
        alt: 'Description 2'
    },
    {
        id: 3,
        url: 'https://plus.unsplash.com/premium_photo-1671221672998-bab0510cfa57?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'Image 3',
        alt: 'Description 3'
    },
]

// LocalStorage keys
const UNSPLASH_CACHE_KEY = 'unsplash_photos_cache';
const CACHE_EXPIRY_KEY = 'unsplash_cache_expiry';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours cache

const Slider = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const sliderRef = useRef(null);
    const slidesRef = useRef([]);

    // Fetch images from Unsplash API
    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Check if cached data exists and is still valid
                const cachedData = localStorage.getItem(UNSPLASH_CACHE_KEY);
                const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
                const now = new Date().getTime();


                if (cachedData && cacheExpiry && now < parseInt(cacheExpiry)) {
                    // Use cached data
                    setImages(JSON.parse(cachedData));
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(
                    `https://api.unsplash.com/photos/random?count=5&client_id=vCptQPrXejSAM_Ef5tmQyTB6DgvYF1dLhdK0QLA5-L0`
                );
                const data = await response.json();
                console.log('Response Data :', data);
                const photosData = data.map(img => ({
                    id: img.id,
                    url: img.urls.regular,
                    alt: img.alt_description || 'Unsplash image'
                }))

                setImages(data.map(img => ({
                    id: img.id,
                    url: img.urls.regular,
                    alt: img.alt_description || 'Unsplash image'
                })));
                // STATIC Img
                // setImages(ststicImg);

                // Save to cache with expiry time
                localStorage.setItem(UNSPLASH_CACHE_KEY, JSON.stringify(photosData));
                localStorage.setItem(CACHE_EXPIRY_KEY, (now + CACHE_DURATION_MS).toString());

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching images:', error);
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    // // Initialize slider animations when images load
    // useEffect(() => {
    //     if (images.length === 0 || isLoading) return;

    //     // Hide all slides except the first one
    //     slidesRef.current.forEach((slide, index) => {
    //         if (index !== 0 && slide) {
    //             gsap.set(slide, { opacity: 0, scale: 0.8 });
    //         }
    //     });
    // }, [images, isLoading]);
    // Initialize slider with clip-path animations
    useEffect(() => {
        if (images.length === 0 || isLoading) return;

        // Set initial clip-path for all slides except the first
        slidesRef.current.forEach((slide, index) => {
            if (slide) {
                if (index === 0) {
                    gsap.set(slide, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' });
                } else {
                    gsap.set(slide, { clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)' });
                }
            }
        });
    }, [images, isLoading]);


    const goToSlide = (index) => {
        if (index === currentIndex || index < 0 || index >= images.length) return;

        const currentSlide = slidesRef.current[currentIndex];
        const nextSlide = slidesRef.current[index];

        // Animation timeline
        const tl = gsap.timeline();

        tl.to(currentSlide, {
            opacity: 0,
            // scale: 1,
            duration: 0.5,
            ease: 'power2.inOut'
        })
            .to(nextSlide, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => setCurrentIndex(index)
            }, '<0.3'); // Overlap animations slightly
    };


    const animateWithClipPath = (direction) => {
        const nextIndex = direction === 'next'
            ? (currentIndex + 1) % images.length
            : (currentIndex - 1 + images.length) % images.length;

        const currentSlide = slidesRef.current[currentIndex];
        const nextSlide = slidesRef.current[nextIndex];

        if (!currentSlide || !nextSlide) return;

        const tl = gsap.timeline();

        // Animate current slide out
        tl.to(currentSlide, {
            clipPath: direction === 'next'
                ? 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'  // Slide up
                : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', // Slide down
            duration: 0.8,
            ease: 'power2.inOut'
        });

        // Animate next slide in
        tl.to(nextSlide, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => setCurrentIndex(nextIndex)
        }, '-=0.6'); // Overlap animations
    };

    const goNext = () => animateWithClipPath('next');
    const goPrev = () => animateWithClipPath('prev');

    // const goNext = () => {
    //     const nextIndex = (currentIndex + 1) % images.length;
    //     goToSlide(nextIndex);
    // };

    // const goPrev = () => {
    //     const prevIndex = (currentIndex - 1 + images.length) % images.length;
    //     goToSlide(prevIndex);
    // };

    if (isLoading) {
        return <div className="slider-loading">Loading images...</div>;
    }

    if (images.length === 0) {
        return <div className="slider-error">No images available</div>;
    }

    return (
        <div className="slider-container">
            <div className="slider-content">
                <div className="slide-number">
                    {images.map((_, index) => (
                        <span key={index} className={`number ${index === currentIndex ? 'active' : ''}`}>{index}</span>
                    ))}
                </div>


                <button className="slider-button prev" onClick={goPrev}>
                    PREV
                </button>
                <button className="slider-button next" onClick={goNext}>
                    NEXT
                </button>

                {/* <div className="slider-dots">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div> */}
            </div>
            <div className="slider" ref={sliderRef}>
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="slide"
                        ref={el => (slidesRef.current[index] = el)}
                    >
                        <h1 className='title text-white text-center text-4xl font-semibold' >{image.title}</h1>
                        <img src={image.url} alt={image.alt} />
                    </div>
                ))}
            </div>


        </div>
    );
};

export default Slider;