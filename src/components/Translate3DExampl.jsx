import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react"


const randomX = gsap.utils.random(-100, 100, 1, true);

const Translate3DExample = () => {
  const container = useRef(null);
  const boxRef = useRef(null);
  const [endX, setEndX] = useState(0);

  useGSAP((context) => {
    const element = container.current;
    gsap.to(".box", {
      x: endX,
      duration: 1.5,
      ease: "power1.out",
    })
    gsap.to(".newbox", {
      x: endX,
      duration: 1.5,
      ease: "power1.out",
    })
    
    // Animate the element
    // gsap.fromTo(
    //   element,
    //   { y: "0%" }, // Starting state
    //   {
    //     y: "-140%", // Ending state
    //     duration: 1.5, // Duration of the animation
    //     ease: "power1.out", // Easing function
    //   }
    // );
  }, { dependencies: [endX], scope: container });

  return (
    <div ref={container} className="flex flex-col items-center justify-center h-screen w-screen bg-black">
      <h1 className="text-4xl font-bold">Animate Me</h1>
      <button onClick={() => setEndX(randomX())}>CLICK ME</button>
      <div className="box" ref={boxRef}>
        {endX}
      </div>
      <div className="newBox" ref={boxRef}>
        {endX}
      </div>
    </div>
  );
};

export default Translate3DExample;
