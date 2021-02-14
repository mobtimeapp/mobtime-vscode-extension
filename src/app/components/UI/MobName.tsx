import React from 'react';

interface MobNameProps {
  type?: string;
  name?: string;
}

export const MobName: React.FC<MobNameProps> = ({ type, name }) => (
  <div>
    <h3>
      <strong>
        {type || 'Mob'}
      </strong>
    </h3>
    <h1 style={{ 
      marginBottom: '20px',
      opacity: name ? 1 : 0.5,
      fontWeight: 700
    }}>
      {name || 'Empty' }
    </h1>
  </div>
)