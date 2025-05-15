import Navbar from './components/Navbar';
import Footer from './components/Footer';

import * as Sentry from '@sentry/react';
import Hero from './components/Hero';
import Features from './components/Features';
import TimelineExmp from './components/TimelineExmp';
import ScrollTriggerExmp from './components/ScrollTriggerExmp';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const App = () => {
  return (
    <main className="bg-white" id="smooth-wrapper">
      <div id="smooth-content">
        <Navbar />
        <section className='h-screen bg-sky-500'>
          <ScrollTriggerExmp />
        </section>
        <section className='h-screen bg-green-500'></section>
        {/* <Hero /> */}
        {/* <Features/> */}
        <section className='h-screen bg-red-500 flex items-center justify-center'>
          <TimelineExmp />
        </section>
        <section className='h-screen bg-yellow-500'></section>
        <Footer />
      </div>
    </main>
  )
}

export default Sentry.withProfiler(App);
