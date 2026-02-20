import { createContext, useContext, useReducer, useEffect } from 'react';
import { db } from '../db';

const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

const initialState = {
  monthlyData: [],
  expenses: [],
  goals: [],
  reminders: [],
  mutualFunds: [],
  fixedDeposits: [],
  categories: [],
  archivedSavings: [],
  recurringRules: [],
  settings: {},
  currentMonth: 0,
  loaded: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'INIT_DATA':
      return { ...state, ...action.payload, loaded: true };
    case 'SET_CURRENT_MONTH':
      return { ...state, currentMonth: action.payload };
    case 'SET_MONTHLY_DATA':
      return { ...state, monthlyData: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    case 'SET_MUTUAL_FUNDS':
      return { ...state, mutualFunds: action.payload };
    case 'SET_FIXED_DEPOSITS':
      return { ...state, fixedDeposits: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_ARCHIVED_SAVINGS':
      return { ...state, archivedSavings: action.payload };
    case 'SET_RECURRING_RULES':
      return { ...state, recurringRules: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function loadAll() {
      const [monthlyData, expenses, goals, reminders, mutualFunds, fixedDeposits, categories, archivedSavings, recurringRules, settingsArr] = await Promise.all([
        db.monthlyData.orderBy('id').toArray(),
        db.expenses.orderBy('id').toArray(),
        db.goals.toArray(),
        db.reminders.toArray(),
        db.mutualFunds.toArray(),
        db.fixedDeposits.toArray(),
        db.categories.orderBy('sortOrder').toArray(),
        db.archivedSavings.toArray(),
        db.recurringRules.toArray(),
        db.settings.toArray(),
      ]);

      const settings = {};
      settingsArr.forEach(s => { settings[s.key] = s.value; });

      dispatch({
        type: 'INIT_DATA',
        payload: {
          monthlyData, expenses, goals, reminders,
          mutualFunds, fixedDeposits, categories,
          archivedSavings, recurringRules, settings,
          currentMonth: Math.max(0, monthlyData.length - 1),
        },
      });
    }
    loadAll();
  }, []);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext);
export const useAppDispatch = () => useContext(AppDispatchContext);
