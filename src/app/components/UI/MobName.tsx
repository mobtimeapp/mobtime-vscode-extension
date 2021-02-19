import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { EditText } from './EditText';

interface MobNameProps {
  type?: string;
  name?: string;
  index: number;
  isEditing?: boolean;
  onEditDone?: () => void;
  onMobNameUpdate?: (name: string) => void;
}

export const MobName: React.FC<MobNameProps> = memo(({ type, name, index, isEditing, onEditDone, onMobNameUpdate }) => {
  return (
    <div style={{ width: '100%' }}>
      <motion.h3
        key={type}
        initial={{ marginLeft: '-10%', opacity: 0 }}
        animate={{ marginLeft: '0%', opacity: 0.7 }}
        transition={{ duration: 0.3 }}
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
        {isEditing ? (<EditText defaultText={name} onDone={onEditDone} onChange={onMobNameUpdate} />) : (name || 'Empty')}
      </motion.h1>
    </div>
  );
});