import React, { type ReactNode } from 'react';
import { ThemeProvider } from 'react-native-elements';

interface CustomThemeProviderProps {
  children: ReactNode;
  theme?: any;
  useDark?: boolean;
}

const RNEThemeProvider = ThemeProvider as any;
const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
  theme,
  useDark,
}) => {
  return (
    <RNEThemeProvider theme={theme} useDark={useDark}>
      {children}
    </RNEThemeProvider>
  );
};

export default CustomThemeProvider;
