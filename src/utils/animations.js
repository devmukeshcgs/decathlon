import gsap from "gsap"

import { ScrollTrigger } from "gsap/all"
gsap.registerPlugin(ScrollTrigger);

export const animateWithGsap = (target, animationProps, scrollProps) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: 'restart reverse restart reverse',
      start: 'top 85%',
      // markers: true,
      ...scrollProps,
    }
  })
}

export const animateWithGsapTimeline = (timeline, rotationRef, rotationState, firstTarget, secondTarget, animationProps) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: 'power2.inOut'
  })

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: 'power2.inOut'
    },
    '<'
  )

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: 'power2.inOut'
    },
    '<'
  )
}


export const fromToAnimateWithGsap = (target, animationProps, scrollProps) => {
  gsap.fromTo(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: 'restart reverse restart reverse',
      start: 'top 85%',
      end: 'bottom 85%',
      markers: true,
      ...scrollProps,
    }
  })
}
export const gsapFun = () => {
  // document.addEventListener('DOMContentLoaded', () => {
  //   const slider = document.querySelector('.slider');
  //   const slides = document.querySelectorAll('.slide');
  //   const sliderContent = document.querySelector('.slider-content');
  //   let currentSlide = 0;
  //   let isAnimating = false;
  //   let currentTopValue = 0;
  //   const elements = [
  //     { selector: '.prefix', delay: 0 },
  //     { selector: '.names', delay: 0.15 },
  //     { selector: '.years', delay: 0.3 },
  //   ]

  //   slides.forEach((slide, idx) => {
  //     if (idx !== 0) {
  //       const img = slide.querySelector('img');
  //       gsap.set(img, { scale: 2, top: "4em" });
  //     }
  //   });
  //   function showNextSlide() {
  //     if (isAnimating) return;
  //     isAnimating = true;
  //     const slide = slides[index];
  //     const img = slide.querySelector('img');
  //     currentTopValue -= 30;

  //     elements.forEach((element) => {
  //       gsap.to(document.querySelector(element.selector), {
  //         top: `-${currentTopValue}px`,
  //         duration: 0.5,
  //         ease: 'power2.inOut',
  //         delay: element.delay,
  //       })
  //     })
  //     gsap.to(img, {
  //       scale: 1,
  //       top: 0,
  //       duration: 0.5,
  //       ease: 'power2.inOut',
  //     })
  //     gsap.to(slide, {
  //       clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
  //       duration: 0.5,
  //       ease: 'power2.inOut',
  //       onComplete: () => {
  //         isAnimating = false;
  //       }
  //     })
  //     currentSlide = (currentSlide + 1) % slides.length;
  //     isAnimating = false;
  //   }
  //   function hideSlide() {
  //     if (isAnimating) return;
  //     isAnimating = true;
  //     const slide = slides[index];
  //     const img = slide.querySelector('img');
  //     currentTopValue += 30;
  //     elements.forEach((element) => {
  //       gsap.to(document.querySelector(element.selector), {
  //         top: `-${currentTopValue}px`,
  //         duration: 0.5,
  //         ease: 'power2.inOut',
  //         delay: element.delay,
  //       })
  //     })
  //     gsap.to(img, {
  //       scale: 2,
  //       top: "4em",
  //       duration: 0.5,
  //       ease: 'power2.inOut',
  //     })
  //     gsap.to(slide, {
  //       clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
  //       duration: 0.5,
  //       ease: 'power2.inOut',
  //       onComplete: () => {
  //         isAnimating = false;
  //       }
  //     })
  //   }
  //   window.addEventListener('wheel', (e) => {
  //     if (isAnimating) return;
  //     if (e.deltaY > 0 && currentSlideIndex < slide.length - 1) {
  //       showNextSlide(currentSlideIndex + 1);
  //     } else if (e.deltaY < 0 && currentSlideIndex > 0) {
  //       hideSlide(currentSlideIndex - 1);
  //     }
  //   })
  // })
}

// [
//   {
//       image: 'https://images.unsplash.com/photo-1743485237407-e00bfb75163e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//       title: 'Image 1',
//       description: 'Description 1'
//   },
//   {
//       image: 'https://images.unsplash.com/photo-1744429523595-2c06b8611242?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//       title: 'Image 2',
//       description: 'Description 2'
//   },
//   {
//       image: 'https://plus.unsplash.com/premium_photo-1671221672998-bab0510cfa57?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//       title: 'Image 3',
//       description: 'Description 3'
//   },
// ]