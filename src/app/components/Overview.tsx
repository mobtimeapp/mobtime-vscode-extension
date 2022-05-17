import React, { useMemo } from 'react';
import { Link, TitleContainer } from './UI/Basic';
import { FiUsers } from 'react-icons/fi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsCardChecklist } from 'react-icons/bs';
import { Goal } from './Goal';
import { MobName } from './UI/MobName';
import { mapGoals } from './Goals';
import { useStore } from '../MobtimeProvider';

export const Overview: React.FC = () => {
  const { state: { settings, mob, goals } } = useStore();
  const mobOders = useMemo(() => 
    settings?.mobOrder.split(',') || [], [settings?.mobOrder]);
  
  const chnageTab = (tabIndex: number) => {
    // dispatch({
    //   type: "ACTIVE_TAB",
    //   index: tabIndex
    // });
  };

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
        <Link
          onClick={() => chnageTab(1)}
        >
          <AiOutlineEdit style={{ marginRight: 6 }}/>
          Edit Mob
        </Link>
      </TitleContainer>
      {mobOders.map((order, orderIndex) => (
        <MobName 
          name={mob && mob[orderIndex]?.name}
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
        <Link
          onClick={() => chnageTab(2)}
        >
          <AiOutlineEdit style={{ marginRight: 6 }}/>
          Edit Goals
        </Link>
      </TitleContainer>
      {mapGoals(goals || []).map(goal => (
        <Goal 
          placeholder={goal?.placholder}
          text={goal?.text}
          id={goal?.id}
          completed={goal?.completed}
          key={goal?.id}
        />
      ))}
    </div>
  );
};