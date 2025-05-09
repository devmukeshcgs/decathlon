import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { appleImg, blueImg, frameImg, heroVideo, smallHeroVideo } from '../utils';
import { useEffect, useRef, useState } from 'react';
import { animateWithGsap, } from '../utils/animations';
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WaitList = () => {
    const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        animateWithGsap('#join-waitlist-text', { x: 50, opacity: 1 })
        animateWithGsap('#join-waitlist-input', { x: -50, opacity: 1 })
        animateWithGsap('.mob-img', { scale: 1, rotate: 90, y: 50, opacity: 1, })

        gsap.fromTo(
            section.querySelector(".yellow-circle"),
            { opacity: 1, },
            {
                opacity: 1,
                left: "50%",
                top: "50%",
                scale: 1.0,
                duration: 1.5,
                scrollTrigger: {
                    trigger: section,
                    start: "-75%", // Animation starts when the top of the section hits 80% of the viewport
                    end: "-25%", // Animation ends when the bottom of the section hits 20% of the viewport
                    scrub: 0.5, // Smoothly update the animation as the user scrolls
                    // markers: true, // Adds markers for debugging (optional)
                },
            }
        );

        // Clean up on component unmount
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);


    return (
        <section ref={sectionRef} id="join-waitlist" className="w-full h-screen flex  relative justify-center items-center">
            <div className=" w-1/3">
                <p id="join-waitlist-text" className="opacity-0 text-black text-center text-2xl font-bold font-serif">Join the waitlist</p>
            </div>
            <div className=" w-1/3">
                {/* <img className="mob-img w-full h-[80%] object-cover opacity-0" src={blueImg} alt="Image" /> */}
                <img
                    src={frameImg}
                    alt="frame"
                    className="mob-img bg-transparent relative z-10"
                />
                <div id="yellow-img" className='yellow-circle img-w  h-[200px] w-[200px] rounded-full align-middle border-none absolute bg-yellow-500  ml-[-100px] mt-[-100px]'></div>

            </div>
            <div className=" w-1/3">
                <p id="join-waitlist-input" className="text-gray-200 text-center text-2xl  font-serif opacity-0">johndow@gmail.com</p>
            </div>
        </section>
    )
}

export default WaitList