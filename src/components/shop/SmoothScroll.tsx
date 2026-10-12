"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll on desktop (native on touch)
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1, // Native touch feel
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Hero Parallax effect
    const heroBg = document.querySelector(".hero-bg-parallax");
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Reveal animations for headlines
    const maskedHeadings = document.querySelectorAll(".headline-mask-reveal");
    maskedHeadings.forEach((heading) => {
      gsap.fromTo(
        heading,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Staggered rise and fade for product cards
    const productCards = document.querySelectorAll(".product-card-stagger");
    if (productCards.length > 0) {
      gsap.fromTo(
        productCards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#flavours",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Clip-path image wipe reveals
    const imageWipes = document.querySelectorAll(".image-clip-reveal");
    imageWipes.forEach((img) => {
      gsap.fromTo(
        img,
        { clipPath: "inset(0 0 100% 0)", scale: 1.1 },
        {
          clipPath: "inset(0 0 0% 0)",
          scale: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: img,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
