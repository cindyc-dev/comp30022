import React, { useState, useEffect } from "react";
import ToastSection from "~/components/common/toastSection";
import { useToast } from "~/components/hooks/toastContext";
import Image from "next/image";

const images = [
  "/images/Frame 1.png",
  "/images/Frame 2.png",
  "/images/Frame 3.png",
  "/images/Frame 4.png",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    // Automatically switch to the next image every 5 seconds
    const intervalId = setInterval(showNextImage, 5000);

    // Cleanup the interval on unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div className="p-10 text-center text-primary lg:text-left">
          <div>
            <Image
              src={images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              width={1920}
              height={1080}
            />
            <div className="carousel-controls">
              <button className="prev" onClick={showPreviousImage}>
                &#8249;
              </button>
              <button className="next" onClick={showNextImage}>
                &#8250;
              </button>
            </div>
          </div>
          <h1 className="text-5xl font-bold">PotatoCRM</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          {children}
        </div>
      </div>
      <ToastSection toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
