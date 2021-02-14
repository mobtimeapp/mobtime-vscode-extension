import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface MobNameProps {
  type?: string;
  name?: string;
  index: number;
}

export const MobName: React.FC<MobNameProps> = memo(({ type, name, index }) => (
  <div style={{ width: '100%' }}>
    <motion.h3
      key={type}
      initial={{ marginLeft: '-10%', opacity: 0 }}
      animate={{ marginLeft: '0%', opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-type={type}
      style={{
        overflow: 'hidden',
      }}
    >
      <strong>
        {type || 'Mob'}
      </strong>
    </motion.h3>
    <motion.h1
      key={`${name || index}`}
      initial={{ rotateX: -90, opacity: 0.4 }}
      animate={{ rotateX: 0, opacity: name ? 1 : 0.5 }}
      style={{ 
        marginBottom: '20px',
        opacity: name ? 1 : 0.5,
        fontWeight: 700
      }}
    >
      {name || 'Empty' }
    </motion.h1>
  </div>
))