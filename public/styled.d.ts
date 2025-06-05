// styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    cardBackground: string;
    buttonBackground: string;
    buttonText: string;
    link: string;
    hover: string;
    sidebarWidth: string;
    colorBg2?: string;
  }
}
