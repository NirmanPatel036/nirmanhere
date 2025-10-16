import React, { useEffect, useState } from 'react';

const COORDS = [
  [50, 30],
  [90, 30],
  [50, 50],
  [60, 60],
  [70, 60],
  [80, 60],
  [90, 50],
];

const STROKE_WIDTH = 0.5;
const OFFSET = STROKE_WIDTH / 2;
const MAX_WIDTH = 150 + OFFSET * 2;
const MAX_HEIGHT = 100 + OFFSET * 2;

export default function GridAnimation() {
  const [gridProgress, setGridProgress] = useState(0);
  const [boxScales, setBoxScales] = useState(new Array(7).fill(0));
  const [animationStarted, setAnimationStarted] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [hasTyped, setHasTyped] = useState(false);
  const [showWarning, setShowWarning] = useState(false);


  useEffect(() => {
    // Start animation after component mounts
    const startAnimation = () => {
      setAnimationStarted(true);
      
      const runCycle = () => {
        // Reset states
        setGridProgress(0);
        setBoxScales(new Array(7).fill(0));
        
        // Grid animation (1.5 seconds)
        const gridDuration = 1500;
        const gridStart = Date.now();
        
        const animateGrid = () => {
          const elapsed = Date.now() - gridStart;
          const progress = Math.min(elapsed / gridDuration, 1);
          
          // Ease out function
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setGridProgress(easeOut);
          
          if (progress < 1) {
            requestAnimationFrame(animateGrid);
          } else {
            // Start box animations after grid completes
            startBoxAnimations();
          }
        };
        
        requestAnimationFrame(animateGrid);
      };
      
      runCycle();
      
      // Start typewriter after first complete cycle
      /*setTimeout(() => {
        startTypewriter();
      }, 1500 + (COORDS.length * 200) + 800);*/
    };

    interface StartBoxAnimationsProps {
        onComplete?: () => void;
    }

    const startBoxAnimations = (onComplete?: () => void): void => {
        let completedBoxes = 0;

        // Animate each box with staggered delays
        COORDS.forEach((_, index: number) => {
            setTimeout(() => {
                animateBox(index, () => {
                    completedBoxes++;
                    if (completedBoxes === COORDS.length) {
                        onComplete && onComplete();
                    }
                });
            }, index * 200);
        });

        // Start typewriter only on first cycle
        if (!hasTyped) {
            setTimeout(() => {
                startTypewriter();
            }, COORDS.length * 200 + 800);
        }
    };

    interface AnimateBoxProps {
        index: number;
        onComplete?: () => void;
    }

    const animateBox = (index: number, onComplete?: () => void): void => {
        const duration = 800;
        const start = Date.now();
        
        const animate = (): void => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Spring-like easing
            const spring = 1 - Math.pow(1 - progress, 2) * Math.cos(progress * Math.PI * 2.5);
            
            setBoxScales((prev: number[]) => {
                const newScales = [...prev];
                newScales[index] = spring;
                return newScales;
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                onComplete && onComplete();
            }
        };
        
        requestAnimationFrame(animate);
    };

    const startTypewriter = () => {
        const text = "Welcome! Scroll down as you rotate along with the stars";
        const showWarning = "⚠️ Caution: You might get hit by a comet ☄️"
        let currentIndex = 0;

        const typeNextChar = () => {
            if (currentIndex < text.length) {
                setTypewriterText(text.substring(0, currentIndex + 1));
                currentIndex++;
                setTimeout(typeNextChar, 80 + Math.random() * 40);
            } else {
                setHasTyped(true); // flag after completion
                setTimeout(() => {
                    setShowWarning(true);
                }, 500);
            }
        };

        typeNextChar();
    };


    // Start animation immediately
    const timer = setTimeout(startAnimation, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-96 h-64">
        <svg 
          viewBox={`0 0 ${MAX_WIDTH} ${MAX_HEIGHT}`}
          className="w-full h-full text-white"
        >
          {/* Grid lines */}
          <g>
            {/* Horizontal lines */}
            {Array.from({ length: 16 }, (_, index) => (
              <line
                key={`h-${index}`}
                x1={0}
                y1={index * 10 + OFFSET}
                x2={MAX_WIDTH * gridProgress}
                y2={index * 10 + OFFSET}
                strokeWidth={STROKE_WIDTH}
                stroke="currentColor"
                style={{
                  transition: 'none'
                }}
              />
            ))}
            {/* Vertical lines */}
            {Array.from({ length: 16 }, (_, index) => (
              <line
                key={`v-${index}`}
                x1={index * 10 + OFFSET}
                y1={0}
                x2={index * 10 + OFFSET}
                y2={MAX_HEIGHT * gridProgress}
                strokeWidth={STROKE_WIDTH}
                stroke="currentColor"
                style={{
                  transition: 'none'
                }}
              />
            ))}
          </g>
          
          {/* Animated boxes */}
          {COORDS.map((coord, index) => (
            <rect
              key={index}
              width={10}
              height={10}
              fill="currentColor"
              style={{
                transformOrigin: `${5 + OFFSET}px ${5 + OFFSET}px`,
                transform: `translate(${coord[0] + OFFSET}px, ${coord[1] + OFFSET}px) scale(${boxScales[index]})`,
                transition: 'none'
              }}
            />
          ))}
        </svg>
      </div>
      
      {/* Typewriter text */}
        <div className="mt-8 text-center text-white text-lg font-mono">
        {typewriterText}
        <span className="animate-pulse">_</span>
        {hasTyped && (
            <>
            <br />
            {showWarning && (
                <div className="text-center mt-4 font-mono" style={{
                animation: 'smoothBlink 2s infinite ease-in-out'
            }}>
                ⚠️ Caution: You might get hit by a comet ☄️
                </div>
            )}
            </>
        )}
        </div>
    </div>
  )
}
