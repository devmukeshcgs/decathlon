import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { heroVideo, smallHeroVideo } from '../utils';
import { useEffect, useState } from 'react';

const SignUp = () => {
    const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)

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
        gsap.to('#hero', { opacity: 1, delay: 2 })
        gsap.to('#cta', { opacity: 1, y: -50, delay: 2 })
    }, [])

    return (
        <section className="w-full h-screen flex  flex-col justify-center relative">
            <div className="flex flex-row">

                <div className=" w-1/3"></div>
                <div className="h-5/6  flex-center flex-col w-1/3 py-8">
                    <p id="hero" className="sec-title-2">Get Europe's most important articals, participets in transnational debates, support great journalism and uphold a free press.</p>
                </div>
            </div>
            <div id="cta" className="text-center py-8" >
                <a href="#highlights" className="text-white bg-black px-4 py-2 rounded-full">Sign Up</a>
            </div>
        </section>
    )
}

export default SignUp