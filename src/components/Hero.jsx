import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { fetchImages } from '../services/unsplashService';

const Hero = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);
    const numOfImg = 8;
    const boxRef = useRef(null);

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

    useGSAP(() => {
        gsap.fromTo(
            '.box',
            { y: -100, opacity: 0 }, // From state
            {
                y: 100, // To state
                opacity: 1, // Fade in
                scrollTrigger: {
                    trigger: '.box',
                    start: "top center",
                    end: "bottom center",
                    scrub: true,
                    // markers: true,
                }
            }
        );
    });


    if (isLoading) {
        return <div className="slider-loading">Loading images...</div>;
    }

    if (images.length === 0) {
        return <div className="slider-error">No images available</div>;
    }

    return (
        <section className='h-screnn'>
            <h1>Hero</h1>
            <div className="container"  >
                {images.map((image, index) => (
                    <div key={image.id} className="absolute my-img" >
                        <img
                            src={image.thumbUrl}
                            alt={image.alt}
                            className=" object-cover"
                        />
                    </div>
                ))}
            </div>
            <div ref={boxRef} className='box'
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "blue",
                    margin: "50px auto",
                    overflow: 'hidden'
                }}>
                ajshdaj 
            </div>

        </section>
    )
}

export default Hero 