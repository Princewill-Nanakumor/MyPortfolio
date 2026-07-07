"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AOSInit = (): null => {
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      duration: 800,
      delay: 100,
      mirror: true,
      anchorPlacement: "top-bottom",
      offset: 120,
    });
    AOS.refresh();
  }, []);

  return null;
};

export default AOSInit;
