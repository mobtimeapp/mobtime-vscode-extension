import React from 'react';
import { motion } from 'framer-motion';

interface MobNameProps {
  type?: string;
  name?: string;
}

export const MobName: React.FC<MobNameProps> = ({ type, name }) => (
  <div>
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
    <h1 style={{ 
      marginBottom: '20px',
      opacity: name ? 1 : 0.5,
      fontWeight: 700
    }}>
      {name || 'Empty' }
    </h1>
  </div>
)