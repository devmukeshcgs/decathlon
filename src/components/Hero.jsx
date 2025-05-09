import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { heroVideo, smallHeroVideo } from '../utils';
 import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);



const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)
  const sectionRef = useRef(null);

  const handleVideoSrcSet = () => {
    if (window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo)
    } else {
      setVideoSrc(heroVideo)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleVideoSrcSet);

    return () => {
      window.removeEventListener('reisze', handleVideoSrcSet)
    }
  }, [])

  useGSAP(() => {
    gsap.to('#hero', { opacity: 1, delay: 0.75 })
    gsap.to('#hero2', { opacity: 1, delay: 1 })
    gsap.to('#cta', { opacity: 1, y: -10, delay: 2 })

    gsap.to('.img1', { top: '30%', left: '20%', delay: 1 }, { opacity: 0, top: "50%", left: "50%", duration: 0.5 })
    gsap.to('.img2', { top: '60%', left: '70%', delay: 1 }, { opacity: 0, top: "50%", left: "50%", duration: 0.5 })
    gsap.to('.img3', { top: '10%', left: '80%', delay: 1 }, { opacity: 0, top: "50%", left: "50%", duration: 0.5 })
    gsap.to('.img4', { top: '70%', left: '30%', delay: 1 }, { opacity: 0, top: "50%", left: "50%", duration: 0.5 })
 
  }, [])


  useEffect(() => {
    const section = sectionRef.current;
    gsap.fromTo(
      section.querySelectorAll(".p-pic"),
      { opacity: 1, },
      {
        opacity: 0,
        left: "50%",
        top: "50%",
        duration: 1.5,
        scrollTrigger: {
          trigger: section,
          start: "start", // Animation starts when the top of the section hits 80% of the viewport
          end: "25%", // Animation ends when the bottom of the section hits 20% of the viewport
          scrub: 2.5, // Smoothly update the animation as the user scrolls
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
    <section className="w-full h-screen bg-red relative" ref={sectionRef}>
      <span className='w-[1px] h-full bg-gray-100 opacity-20 z-0 absolute top-[100%] left-[50%] translate-x-[-50%] translate-y-[-50%]'></span>

      <div className="h-5/6 w-full flex-center flex-col justify-center bg-blue-500">
        <p id="hero" className="hero-title z-10">Create</p>
        <p id="hero2" className="hero-title-2 z-10">the European  Public</p>
        <div className='p-pic img-w  h-[100px] w-[100px] rounded-full align-middle border-none absolute bg-white  ml-[-50px] mt-[-50px]'></div>
        <div className="position-relative md:w-10/12 w-9/12 bg-pink-500">
          <img src="https://github.com/creativetimofficial/soft-ui-dashboard-tailwind/blob/main/build/assets/img/team-1.jpg?raw=true" className="p-pic img1  shadow-xl rounded-full align-middle border-none absolute   w-[100px] ml-[-50px] mt-[-50px]" />
          <img src="https://github.com/creativetimofficial/soft-ui-dashboard-tailwind/blob/main/build/assets/img/team-2.jpg?raw=true" className="p-pic img2  shadow-xl rounded-full align-middle border-none absolute   w-[100px] ml-[-50px] mt-[-50px]" />
          <img src="https://github.com/creativetimofficial/soft-ui-dashboard-tailwind/blob/main/build/assets/img/team-3.jpg?raw=true" className="p-pic img3  shadow-xl rounded-full align-middle border-none absolute   w-[100px] ml-[-50px] mt-[-50px]" />
          <img src="https://github.com/creativetimofficial/soft-ui-dashboard-tailwind/blob/main/build/assets/img/team-4.jpg?raw=true" className="p-pic img4  shadow-xl rounded-full align-middle border-none absolute   w-[100px] ml-[-50px] mt-[-50px]" />
        </div>
      </div>

      <div id="cta" className="flex flex-col items-center opacity-0 translate-y-10" >
        <a id="" href="#highlights" className=" text-black">Learn More</a>
      </div>

    </section>
  )
}

export default Hero