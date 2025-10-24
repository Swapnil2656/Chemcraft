'use client';

import { useEffect, useRef, useState } from 'react';

const VantaBackground: React.FC = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !vantaRef.current || typeof window === 'undefined') return;

    const initVanta = async () => {
      try {
        // Destroy existing effect first
        if (vantaEffect.current) {
          vantaEffect.current.destroy();
          vantaEffect.current = null;
        }

        // Import THREE.js
        const THREE = await import('three');
        
        // Try to load Vanta via CDN for better compatibility
        if (typeof window !== 'undefined') {
          const loadVantaScript = () => {
            return new Promise<void>((resolve, reject) => {
              // Check if already loaded
              if ((window as any).VANTA) {
                resolve();
                return;
              }

              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
              script.onload = () => resolve();
              script.onerror = () => reject(new Error('Failed to load Vanta.js'));
              document.head.appendChild(script);
            });
          };

          try {
            await loadVantaScript();
            
            // Configuration for NET effect with dark theme colors
            const config = {
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 1.0,
              scaleMobile: 1.0,
              color: 0x3b82f6, // Blue color for network lines
              backgroundColor: 0x0f172a, // Dark slate background
              points: 10,
              maxDistance: 20,
              spacing: 15,
              showDots: true,
            };

            // Initialize effect
            const vanta = (window as any).VANTA;
            if (vanta && vanta.NET) {
              vantaEffect.current = vanta.NET(config);
            }
          } catch (loadError) {
            console.warn('Failed to load Vanta.js from CDN:', loadError);
          }
        }
      } catch (error) {
        console.warn('Failed to initialize Vanta background:', error);
      }
    };

    const timeoutId = setTimeout(initVanta, 300);

    return () => {
      clearTimeout(timeoutId);
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (e) {
          console.warn('Error destroying Vanta effect:', e);
        }
        vantaEffect.current = null;
      }
    };
  }, [mounted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (e) {
          console.warn('Error destroying Vanta effect on unmount:', e);
        }
        vantaEffect.current = null;
      }
    };
  }, []);

  // Always render the same structure to prevent hydration mismatch
  return (
    <div
      ref={mounted ? vantaRef : null}
      className="fixed inset-0 -z-20 w-screen h-screen bg-slate-900"
      suppressHydrationWarning
    />
  );
};

export default VantaBackground;