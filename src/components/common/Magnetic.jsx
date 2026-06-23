import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Magnetic = ({ children }) => {
    const ref = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        if (!ref.current) return;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        setPos({ x: (clientX - (left + width / 2)) * 0.45, y: (clientY - (top + height / 2)) * 0.45 });
    };

    return (
        <motion.div
            style={{ position: "relative" }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

Magnetic.propTypes = {
    children: PropTypes.node.isRequired
};

export default Magnetic;
