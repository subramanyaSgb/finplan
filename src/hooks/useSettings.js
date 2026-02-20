import { useCallback } from 'react';
import { db } from '../db';
import { useAppState, useAppDispatch } from '../context/AppContext';

export function useSettings() {
  const { settings } = useAppState();
  const dispatch = useAppDispatch();

  const getSetting = useCallback((key, fallback = null) => {
    return settings[key] !== undefined ? settings[key] : fallback;
  }, [settings]);

  const setSetting = useCallback(async (key, value) => {
    await db.settings.put({ key, value });
    dispatch({ type: 'SET_SETTINGS', payload: { [key]: value } });
  }, [dispatch]);

  const defaultCurrency = getSetting('defaultCurrency', 'INR');

  return { settings, getSetting, setSetting, defaultCurrency };
}
