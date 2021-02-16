import React, { useMemo } from 'react';
import { useStore } from '../StoreProvider';
import { Link, TitleContainer } from './UI/Basic';
import { FiUsers } from 'react-icons/fi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsCardChecklist } from 'react-icons/bs';
import { Goal } from './Goal';
import { MobName } from './UI/MobName';

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
        <MobName 
          name={mob[orderIndex]?.name}
          key={orderIndex}
          type={order}
          index={orderIndex}
        />
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
        text={goals[0]?.text}
        id={goals[0]?.id}
        completed={goals[0]?.completed}
      />
      <Goal 
        placeholder="A grate day would be..."
        text={goals[1]?.text}
        id={goals[1]?.id}
        completed={goals[1]?.completed}
      />
    </div>
  );
};