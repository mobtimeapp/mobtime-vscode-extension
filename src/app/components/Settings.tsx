import React, { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { useStore } from '../StoreProvider';
import { TitleContainer } from './UI/Basic';
import { FiUsers } from 'react-icons/fi';
import { VscHistory } from 'react-icons/vsc';
import { Store } from '../shared/eventTypes';
import { ActionsButtons } from './Mobs';
import { Button } from './UI/Button';
import { AnimatePresence, motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Input } from './UI/Input';

export const Settings: React.FC = () => {
  const { state: { settings }, dispatch } = useStore();
  const [currentSettings, setSettings] = useState<Store['settings']>({
    duration: settings?.duration ? settings.duration / 60000 : 0,
    mobOrder: settings.mobOrder
  });

  const isFormUpdated = useMemo(() => 
    currentSettings.duration !== (settings?.duration ? settings.duration / 60000 : 0)
    || currentSettings.mobOrder !== settings?.mobOrder
  , [currentSettings, settings]);

  const isDurationValid = useMemo(() => 
    currentSettings.duration 
    && currentSettings.duration >= 0
  , [currentSettings.duration]);

  const isMobOrderValid = useMemo(() => 
    currentSettings.mobOrder.split(',')
      .filter(o => o)
      .length > 0
  , [currentSettings.mobOrder]);

  const isFormInvalid = useMemo(() => 
    isDurationValid && isMobOrderValid
  , [isDurationValid, isMobOrderValid]);

  const handleDurationUpdate: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value.replace(/![0-9]/g, '');
    if (value) {
      setSettings(settings => ({
        ...settings, 
        duration: parseInt(value)
      }));
      return;
    }
    setSettings(settings => ({
      ...settings, 
      duration: 0
    }));
  };

  const handleMobOrder: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSettings(settings => ({
      ...settings, 
      mobOrder: e.target.value
    }));
  };

  const handleSubmit = useCallback(() => {
    dispatch({
      type: 'settings:update',
      settings: {
        duration: currentSettings.duration * 60000,
        mobOrder: currentSettings.mobOrder
          .split(',')
          .filter(o => o)
          .join(',')
      }
    });
  }, [currentSettings, dispatch]);

  const handleCancel = useCallback(() => {
    setSettings({
      duration: settings?.duration ? settings.duration / 60000 : 0,
      mobOrder: settings.mobOrder
    });
  }, [currentSettings, dispatch, settings]);

  return (
    <div>
      <TitleContainer>
        <h4>
          <VscHistory
            style={{ 
              marginRight: 10,
              marginBottom: -6
            }} 
            size={20}
          />
          Turn Duration
        </h4>
      </TitleContainer>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Input 
          value={currentSettings.duration || ''}
          onChange={handleDurationUpdate}
          type="number"
          errorMessage={isDurationValid ? undefined : "Invalid Duration"}
        />
        <p style={{ marginLeft: 10, marginTop: 6 }}>
          Minutes
        </p>
      </div>
      <TitleContainer>
        <h4>
          <FiUsers
            style={{ 
              marginRight: 10,
              marginBottom: -6
            }} 
            size={20}
          />
          Mob Order
        </h4>
      </TitleContainer>
      <Input
        value={currentSettings.mobOrder}
        type="text"
        onChange={handleMobOrder}
        errorMessage={isMobOrderValid ? undefined : "invalid Mob order"}
      />
      <p style={{ opacity: 0.8, marginTop: 5 }}>
        One or more comma separated list of positions
      </p>
      <AnimatePresence>
        {isFormUpdated && (
          <Buttons 
            initial={{ 
              y: 50,
              opacity: 0
            }}
            animate={{ 
              y: 0,
              opacity: 1
            }}
            exit={{ 
              y: 50,
              opacity: 0
            }}
          >
            <Button
              style={{
                opacity: isFormInvalid ? 1 : 0.5
              }}
              disabled={!isFormInvalid}
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button 
              className="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Buttons>
        )}
      </AnimatePresence>
    </div>
  );
};

const Buttons = styled(motion.custom(ActionsButtons))`
  margin-top: 5px
`;