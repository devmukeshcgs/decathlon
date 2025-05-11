import Navbar from './components/Navbar';
import Footer from './components/Footer';

import * as Sentry from '@sentry/react';
import Hero from './components/Hero';
import Features from './components/Features';
import TimelineExmp from './components/TimelineExmp';
const App = () => {
  return (
    <main className="bg-white">
      <Navbar />
      <section className='h-screen bg-sky-500'></section>
      {/* <Hero /> */}
      {/* <Features/> */}
      <section className='h-screen bg-red-500'></section>
      <TimelineExmp/>
      <section className='h-screen bg-yellow-500'></section>
      <section className='h-screen'></section>
      <Footer />
    </main>
  )
}

export default Sentry.withProfiler(App);
