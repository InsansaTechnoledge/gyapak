import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeatureBand = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        threshold: 0.1, // Trigger animation when 10% of the element is visible
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div >
            <div className="relative overflow-hidden bg-purple-400 py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-800" />
                <motion.div
                    ref={ref}
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    variants={variants}
                    initial="hidden"
                    animate={controls}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className="text-4xl xl:text-6xl font-bold text-white mb-6"
                        variants={variants}
                        transition={{ duration: 1 }}
                    >
                        Never Miss an Important Exam Date Again
                    </motion.h1>
                    <motion.p
                        className="text-xl text-blue-100 max-w-2xl mx-auto mb-10"
                        variants={variants}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        Your go-to platform for accurate, up-to-date, and user-friendly government exam schedules and deadlines.
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default FeatureBand;
