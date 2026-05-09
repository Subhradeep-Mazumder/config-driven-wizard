import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/auth/authSlice';
import wizardReducer from './slices/wizard/wizardSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  wizard: wizardReducer,
});

const persistConfig = {
  key: 'config-driven-wizard',
  version: 1,
  storage,
  whitelist: ['auth', 'wizard'],
};

const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
