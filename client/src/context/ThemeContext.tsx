import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, toggleTheme as toggleThemeAction } from '../store';
import type { RootState } from '../store';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  return { theme, toggleTheme };
};

