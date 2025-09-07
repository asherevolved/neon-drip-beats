import { useEffect, useRef, useState } from 'react';

interface SplashProps {
  onFinish?: () => void;
}

export default function Splash({ onFinish }: SplashProps) {
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Safety fallback: if video doesn't fire ended, finish after 5s
    const fallback = setTimeout(() => {
      if (!animating) {
        setAnimating(true);
        setTimeout(() => {
          setVisible(false);
          onFinish?.();
        }, 800);
      }
    }, 5000);

    return () => clearTimeout(fallback);
  }, [animating, onFinish]);

  if (!visible) return null;

  const handleEnded = () => {
    // Trigger zoom-in + fade animation, then hide
    setAnimating(true);
    setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 800); // allow animation to play
  };

  return (
    <div className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden ${animating ? 'pointer-events-none' : ''}`}>
      <div
        className={`absolute inset-0 flex items-center justify-center transform transition-all duration-700 ${animating ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
        aria-hidden
      >
        <video
          ref={videoRef}
          src="/Neon_Entertainment_Logo_Animation.mp4"
          autoPlay
          playsInline
          muted
          onEnded={handleEnded}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
