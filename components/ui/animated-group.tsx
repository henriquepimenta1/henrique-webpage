'use client';
import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import React from 'react';

type PresetType = 'fade' | 'slide' | 'scale' | 'blur' | 'blur-slide' | 'zoom' | 'bounce';

type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variants?: { container?: Variants; item?: Variants };
  preset?: PresetType;
};

const defaultContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const presets: Record<PresetType, { container: Variants; item: Variants }> = {
  fade: {
    container: defaultContainer,
    item: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } },
  },
  slide: {
    container: defaultContainer,
    item: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } } },
  },
  scale: {
    container: defaultContainer,
    item: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } },
  },
  blur: {
    container: defaultContainer,
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.7 } },
    },
  },
  'blur-slide': {
    container: defaultContainer,
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
    },
  },
  zoom: {
    container: defaultContainer,
    item: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    },
  },
  bounce: {
    container: defaultContainer,
    item: {
      hidden: { opacity: 0, y: -40 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 12 } },
    },
  },
};

export function AnimatedGroup({ children, className, style, variants, preset }: AnimatedGroupProps) {
  const selected = preset ? presets[preset] : { container: defaultContainer, item: presets.fade.item };
  const containerVariants = variants?.container || selected.container;
  const itemVariants = variants?.item || selected.item;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={className} style={style}>
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants} style={{ display: 'contents' }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
