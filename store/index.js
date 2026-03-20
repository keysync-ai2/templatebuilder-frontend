import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import brandReducer from './slices/brandSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import templateBuilderReducer from './slices/templateBuilderSlice';
import emailBuilderReducer from './slices/emailBuilderSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      brand: brandReducer,
      chat: chatReducer,
      ui: uiReducer,
      templateBuilder: templateBuilderReducer,
      emailBuilder: emailBuilderReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

// Infer the type of makeStore
export const store = makeStore();
