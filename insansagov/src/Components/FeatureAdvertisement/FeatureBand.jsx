import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FeatureBandDescription, FeatureBandSecondDescription, FeatureBandTitle } from "../../constants/Constants";

const FeatureBand = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1, // Trigger animation when 10% of the element is visible
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 main-site-color" />
        <motion.div
          ref={ref}
          className="relative mx-auto px-4 sm:px-6 lg:px-8 text-center "
          variants={variants}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl xl:text-6xl font-bold text-white mb-6 "
            variants={variants}
            transition={{ duration: 1 }}
          >
            {FeatureBandTitle}
          </motion.h1>
          <motion.p
            className="text-xl text-blue-100 max-w-2xl mx-auto mb-10"
            variants={variants}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {FeatureBandDescription}
          </motion.p>
        </motion.div>
      </div>
      <motion.div
        ref={ref}
        className="max-w-5xl mx-auto px-4 py-8 text-center"
        variants={variants}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.7 }}
      >
        {/* <h2 className="text-4xl md:text-4xl font-bold text-gray-800 mb-4">
          About Us
        </h2> */}
        <p  className="utility-secondary-color text-base md:text-lg leading-relaxed  mx-auto">
          {FeatureBandSecondDescription}
        </p>
      </motion.div>
    </div>
  );
};

export default FeatureBand;
