import { useContext, createContext, ReactElement } from 'react';

export type Theme = {
  primary: string;
  secondary: string;
  tertiary: string;
  main: string;
  primaryTextLight: string;
  primaryTextDefault: string;
  background: string;
  success: string;
  error: string;
  danger: string;
  info: string;
  warning: string;
  card: string;
  inputBg: string;
  textDisabled: string;
  secondaryTextDefault: string;
  backgroundDarkTransparent: string;
  placeholder: string;
}

type ThemeContextData = {
  theme: Theme
}

type Props = {
  children: ReactElement;
}

export const ThemeContext = createContext({} as ThemeContextData);

function ThemeProvider({ children }: Props) {
  const lightTheme: Theme = {
    primary: '#F3C9E0',
    secondary: '#F27E7E',
    tertiary: '#74445C',
    main: '#D989BD',
    primaryTextDefault: '#2B2B2B',
    secondaryTextDefault: '#000000a6',
    primaryTextLight: '#FFFFFF',
    // background: '#FFFAFA',
    background: '#ffff',
    error: '#F44336',
    danger: '#F3C9C9',
    card: '#FFFAFA',
    inputBg: '#FFE7F4',
    success: '#C9F3CA',
    info: '#C9D2F3',
    textDisabled: '#909090',
    backgroundDarkTransparent: '#00000099',
    placeholder: '#909090',
    warning: '#F3EFC9'
  }

  return (
    <ThemeContext.Provider value={{ theme: lightTheme }}>
      { children }
    </ThemeContext.Provider>
  )
}

function useTheme() {
  return useContext(ThemeContext);
}

export { ThemeProvider, useTheme };