import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

function useOnScreen(ref, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    let currentRef = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      }
    );
    if (ref.current) {
      currentRef = ref.current;
      observer.observe(currentRef);
    }
    return () => {
      observer.unobserve(currentRef);
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}

const LazyShow = ({ children }) => {
  const controls = useAnimation();
  const rootRef = useRef();
  const onScreen = useOnScreen(rootRef);
  
  useEffect(() => {
    if (onScreen) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: {
          duration: 1.5, // Adjust the duration here
          ease: "easeInOut",
        },
      });
    }
  }, [onScreen, controls]);
  
  return (
    <motion.div
      className="lazy-div"
      ref={rootRef}
      initial={{ opacity: 0, y: 50 }} // Start from bottom (increase y value)
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

export default LazyShow;
