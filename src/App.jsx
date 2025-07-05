import Navbar from './components/Navbar';
import Footer from './components/Footer';

import * as Sentry from '@sentry/react';
import Features from './components/Features';
import TimelineExmp from './components/TimelineExmp';
import ScrollTriggerExmp from './components/ScrollTriggerExmp';
import gsap from 'gsap';
import { fetchImages } from './services/unsplashService';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const App = () => {
  const numOfImg = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);

  const rootRef = useRef(null);
  const containerRef = useRef(null);

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
    const boxes = rootRef.current.querySelectorAll('.img'); // Select all .box elements
    const textSpacer = rootRef.current.querySelector('.text-spacer');
    const clipSec = rootRef.current.querySelector('.clip-sec ');
    console.log(textSpacer);
    // let st = ScrollTrigger.create();


    // Create the timeline
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".trigger",
        pin: ".pin-sec",
        start: "top top",
        end: "100% botom",
        markers: true,
        scrub: 1,
      }
    });
    // SPACER TL
    timeline.fromTo(textSpacer, {
      width: "0%",
      transformOrigin: "center center",
      ease: "power2.inOut",
    }, {
      duration: 1,
      width: "100%",
      transformOrigin: "center center",
      ease: "power2.inOut",
    });
    // CLIP TL
    timeline.fromTo(clipSec, {
      // clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
       clipPath: "circle(0% at 50% 50%)",
      transformOrigin: "center center",
      ease: "power2.inOut",
    }, {
      // clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      clipPath: "circle(100% at 50% 50%)",
      duration: 1,
      transformOrigin: "center center",
      ease: "power2.inOut",
    }, "-=1");
  })

  return (
    <main className="bg-white" id="smooth-wrapper" ref={rootRef}>
      <div id="smooth-content">
        <Navbar />
        {/* <Hero /> */}
        <section className='h-screen bg-sky-500  flex items-center justify-center'> </section>
        {/* <ScrollTriggerExmp /> */}
        <section className='pin-sec h-screen trigger relativeh-screen bg-green-500  flex items-center justify-center'>

          <div className='clip-sec h-screen w-screen bg-orange-500  flex items-center justify-center z-20'>
            <div className='pin-sec2'>
              <div className='pin-sec-inner'>
                <div className='pin-sec-inner-box'>
                  <div className='text-3xl font-bold flex justify-center flex-rwo'>
                    <span>CLIP</span>
                    <span ></span>
                    <span>SECTION</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='h-screen w-screen  align-center flex justify-center flex-col items-center pin-sec'>
            <div className='main-test text-3xl font-bold width-50 flex justify-center flex-row  items-center '>
              <span >CLIP</span>
              <span className='text-spacer'></span>
              <span>SECTION</span>
            </div>
            {/* <h1 className='text-3xl font-bold '>PIN<span className='text-spacer'></span> TRIGGER</h1> */}
          </div>
        </section>
        {/* <Features/> */}
        <section className='h-screen bg-red-500 flex items-center justify-center'></section>
         <TimelineExmp images={images} /> 
        <section className='h-screen bg-yellow-500  flex items-center justify-center'></section>
        <section className='h-screen bg-green-500  flex items-center justify-center'></section>
        <section className='h-screen bg-sky-500  flex items-center justify-center'> </section>
        <section className='h-screen bg-green-500  flex items-center justify-center'></section>
        <Footer />
      </div>
    </main>
  )
}

export default Sentry.withProfiler(App);
