import { useRef, useCallback } from 'react'
import { motion, useMotionValue } from 'framer-motion'

const Magnetic = ({ children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouse = useCallback((e) => {
        if (!ref.current) return;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        x.set((e.clientX - (left + width / 2)) * 0.35);
        y.set((e.clientY - (top + height / 2)) * 0.35);
    }, [x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.div
            style={{ position: "relative", x, y }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            animate={{ x: x.get(), y: y.get() }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

export default Magnetic;