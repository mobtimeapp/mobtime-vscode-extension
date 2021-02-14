import React, { useMemo } from 'react';
import { useStore } from '../StoreProvider';
import { Link, TitleContainer } from './UI/Basic';
import { FiUsers } from 'react-icons/fi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsCardChecklist } from 'react-icons/bs';
import { Goal } from './Goal';

export const Overview: React.FC = () => {
  const { state: { settings, mob, goals } } = useStore();
  const mobOders = useMemo(() => 
    settings?.mobOrder.split(',') || [], [settings?.mobOrder]);

  return (
    <div>
      <TitleContainer>
        <h3>
          <FiUsers
            style={{ 
              marginRight: 10,
              marginBottom: -6
            }} 
            size={24}
          />
          Who's up
        </h3>
        <Link>
          <AiOutlineEdit style={{ marginRight: 6 }}/>
          Edit Mob
        </Link>
      </TitleContainer>
      {mobOders.map((order, orderIndex) => (
        <React.Fragment key={order}>
          <h3>
            <strong>
              {order}
            </strong>
          </h3>
          <h1 style={{ 
            marginBottom: '20px',
            opacity: (mob && mob[orderIndex]?.name)  ? 1 : 0.5,
            fontWeight: 700
          }}>
            {(mob && mob[orderIndex]?.name) || 'Empty' }
          </h1>
        </React.Fragment>
      ))}
      <TitleContainer>
        <h3>
          <BsCardChecklist
            style={{ 
              marginRight: 10,
              marginBottom: -6
            }} 
            size={24}
          />
          Top Goals
        </h3>
        <Link>
          <AiOutlineEdit style={{ marginRight: 6 }}/>
          Edit Goals
        </Link>
      </TitleContainer>
      <Goal 
        placeholder="A good day would be..."
        {...(goals ? goals[0] : {})}
      />
      <Goal 
        placeholder="A grate day would be..."
        {...(goals ? goals[1] : {})}
      />
    </div>
  );
};