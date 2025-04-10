"use client";
import { useState, useEffect } from "react";



export default function BackgroundSection({ children }) {
  const [bgImage, setBgImage] = useState("/assets/bg_laptop.png");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBgImage("/assets/bg_phone.png");
      } else {
        setBgImage("/assets/bg_laptop.png");
      }
    };

    // Initial check after mount
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="bg-center bg-no-repeat bg-cover bg-gray-500 bg-blend-multiply "
      style={{
        backgroundImage: `url(${bgImage || ""})`,
      }}
    >
      <div className="px-4 mx-auto max-w-screen-xl text-center h-screen">
        {children}
      </div>
    </section>
  );
}