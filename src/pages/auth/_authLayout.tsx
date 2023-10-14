import React, { useState, useEffect } from "react";
import ToastSection from "~/components/common/toastSection";
import { useToast } from "~/components/hooks/toastContext";
import Image from "next/image";

const CAROUSEL = [
  {
    image: "/images/Frame 1.png",
    title: "Connections",
    blurb: "Foster and manage valuable connections with our Connections page. Here, you can effortlessly keep track of your clients, leads, and contacts. Build and nurture relationships, store important contact details, and track interactions in one centralized hub. Strengthen your network and watch your CRM relationships flourish.",
  },
  {
    image: "/images/Frame 2.png",
    title: "Calendar",
    blurb: "Stay organized and never miss a beat with our Calendar page. Keep track of important dates, meetings, and deadlines all in one place. Schedule, view, and manage your events with ease. Our interactive calendar ensures you're always on top of your commitments and can efficiently plan your days.",
  },
  {
    image: "/images/Frame 3.png",
    title: "Dashboard",
    blurb: "Get a real-time overview of your business operations with our Dashboard page. Access key metrics, analytics, and insights at a glance. Customizable widgets allow you to tailor your dashboard to your specific needs, giving you a comprehensive view of your CRM data. Make data-driven decisions and stay in control of your business.",
  },
  {
    image: "/images/Frame 4.png",
    title: "Trello Board",
    blurb: "Experience a comprehensive view of your daily workflow with our all-in-one Dashboard. Stay on top of your schedule with today's calendar. Monitor your Trello tasks and projects in real-time, helping you manage your workload efficiently. Access your contacts, fostering connections and tracking interactions, all in one centralized hub.",
  }
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % CAROUSEL.length);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? CAROUSEL.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    // Automatically switch to the next image every 4 seconds
    const intervalId = setInterval(showNextImage, 4000);

    // Cleanup the interval on unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div className="py-0 px-0  text-center text-primary lg:text-left">
          <div className="w-full flex items-center justify-center flex-col">
            <div className="flex gap-3">
              <Image
                src="/svg/favicon.svg"
                alt="Potato Logo"
                width={50}
                height={0}
                className="m-0 p-0"
              />
              <h1 className="text-5xl font-bold">PotatoCRM</h1>
            </div>
            <Image
              src={CAROUSEL[currentImageIndex].image}
              alt={`Image ${currentImageIndex + 1}`}
              width={1000}
              height={0}
            />
            <div className="w-full flex items-center justify-center gap-5">
              <button className="prev" onClick={showPreviousImage}>
                &#8249;
              </button>
              {CAROUSEL.map((_, i) => (
                <div key={i} className={`${i === currentImageIndex ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-base-300"} rounded-full mt-1 cursor-pointer`} onClick={() => setCurrentImageIndex(i)}></div>
              ))}
              <button className="next" onClick={showNextImage}>
                &#8250;
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold">{CAROUSEL[currentImageIndex].title}</h1>
          <p className="py-2">
            {CAROUSEL[currentImageIndex].blurb}
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
