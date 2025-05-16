 import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const SiteLoader = () => {
  const [progress, setProgress] = useState(0);
  const [networkStatus, setNetworkStatus] = useState('checking');
  const [loadedAssets, setLoadedAssets] = useState([]);
  const loaderRef = useRef();
  const progressRef = useRef();
  const progressNumberRef = useRef();
  const statusTextRef = useRef();
  const assetsListRef = useRef();

  // Check network connection speed
  useEffect(() => {
    const checkNetworkSpeed = async () => {
      try {
        const startTime = performance.now();
        const response = await fetch('https://httpbin.org/stream-bytes/10000', {
          cache: 'no-store'
        });
        
        if (!response.ok) throw new Error('Network test failed');
        
        const reader = response.body.getReader();
        let totalBytes = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          totalBytes += value.length;
        }
        
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // in seconds
        const speed = (10000 / duration) / 1024; // in KB/s
        
        if (speed < 100) {
          setNetworkStatus('slow');
          // Show tips for slow connection
          gsap.to(statusTextRef.current, {
            textContent: 'Slow network detected. Optimizing...',
            duration: 0.5
          });
        } else {
          setNetworkStatus('good');
        }
      } catch (error) {
        setNetworkStatus('unstable');
        console.warn('Network speed test failed:', error);
      }
    };

    checkNetworkSpeed();
  }, []);

  // Track all page resources
  useEffect(() => {
    const resources = new Set();
    let totalResources = 0;
    let loadedResources = 0;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!resources.has(entry.name)) {
          resources.add(entry.name);
          totalResources++;
          
          if (entry.duration > 0) {
            loadedResources++;
            setLoadedAssets(prev => [...prev, entry.name]);
          }
          
          const newProgress = Math.min(
            ((loadedResources / totalResources) * 90) + 10, // Keep 10% for post-load
            100
          );
          setProgress(newProgress);
        }
      });
    });

    observer.observe({ type: 'resource', buffered: true });

    // Also track images that might not be caught by PerformanceObserver
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        loadedResources++;
        setLoadedAssets(prev => [...prev, img.src]);
      } else {
        img.addEventListener('load', () => {
          loadedResources++;
          setLoadedAssets(prev => [...prev, img.src]);
          const newProgress = Math.min(
            ((loadedResources / (totalResources + images.length)) * 90) + 10,
            100
          );
          setProgress(newProgress);
        });
        img.addEventListener('error', () => {
          loadedResources++; // Count as loaded even if errored
        });
      }
    });

    // Fallback for when PerformanceObserver isn't supported
    const fallbackCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        setProgress(100);
        clearInterval(fallbackCheck);
      }
    }, 500);

    return () => {
      observer.disconnect();
      clearInterval(fallbackCheck);
    };
  }, []);

  // Animation and state management
  useGSAP(() => {
    // Update progress display
    gsap.to(progressNumberRef.current, {
      textContent: Math.floor(progress),
      duration: 0.5,
      snap: { textContent: 1 }
    });
    
    gsap.to(progressRef.current, {
      width: `${progress}%`,
      duration: 0.5
    });

    // Handle completion
    if (progress >= 100) {
      const tl = gsap.timeline();
      
      // Finalize progress display
      tl.to(progressNumberRef.current, {
        textContent: '100',
        duration: 0.3,
        snap: { textContent: 1 }
      });
      
      tl.to(progressRef.current, {
        width: '100%',
        duration: 0.3
      }, '<');
      
      // Show completion message based on network status
      let completionMessage = 'Ready!';
      if (networkStatus === 'slow') {
        completionMessage = 'Loaded (slow connection)';
      } else if (networkStatus === 'unstable') {
        completionMessage = 'Loaded (unstable network)';
      }
      
      tl.to(statusTextRef.current, {
        textContent: completionMessage,
        duration: 0.5
      });
      
      // Animate out
      tl.to(loaderRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.display = 'none';
          }
        }
      });
    }
  }, [progress, networkStatus]);

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-colors duration-300 p-4"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 
            ref={statusTextRef}
            className="text-xl font-bold text-gray-800 dark:text-white"
          >
            {networkStatus === 'checking' ? 'Checking network...' : 'Loading...'}
          </h2>
          <div className="text-right">
            <span 
              ref={progressNumberRef}
              className="text-lg font-medium text-gray-800 dark:text-white"
            >
              0
            </span>
            <span className="text-lg font-medium text-gray-800 dark:text-white">%</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
          <div 
            ref={progressRef}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-0"
          />
        </div>
        
        {/* Network status indicator */}
        <div className="flex items-center mb-4">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            networkStatus === 'good' ? 'bg-green-500' : 
            networkStatus === 'slow' ? 'bg-yellow-500' : 
            networkStatus === 'unstable' ? 'bg-red-500' : 'bg-gray-500'
          }`} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {networkStatus === 'good' ? 'Good connection' : 
             networkStatus === 'slow' ? 'Slow connection' : 
             networkStatus === 'unstable' ? 'Unstable connection' : 'Checking network...'}
          </span>
        </div>
        
        {/* Loading details (shown only on slow connections) */}
        {networkStatus === 'slow' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Loading assets:
            </h3>
            <div 
              ref={assetsListRef}
              className="max-h-32 overflow-y-auto text-xs text-gray-600 dark:text-gray-400"
            >
              {loadedAssets.slice(-5).map((asset, index) => (
                <div key={index} className="truncate py-1">
                  {new URL(asset).pathname.split('/').pop() || asset}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tips for slow connections */}
        {networkStatus === 'slow' && (
          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
            Tip: Try moving closer to your router or disabling other bandwidth-heavy applications.
          </div>
        )}
      </div>
    </div>
  );
};

 export default SiteLoader;