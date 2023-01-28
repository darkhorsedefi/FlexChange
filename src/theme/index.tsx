import React, { useMemo } from 'react'
import styled, { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle, css } from 'styled-components'
import { Text, TextProps } from 'rebass'
import { useThemeColors } from '../hooks/useColor'
import { useIsDarkMode } from '../state/user/hooks'
import { darkTheme, lightTheme } from './colors'
import { Colors } from './styled'

export * from './components'

const MEDIA_WIDTHS = {
  upToExtraSmall: 540,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
  // ------------
  laptop: 1024,
  tabletL: 880,
  tabletM: 768,
  mobileL: 425,
  mobileM: 375,
  mobileS: 340,
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean) {
  return {
    white,
    black,

    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    primaryText1: darkMode ? '#fff' : '#000',

    red1: '#FD4040',
    red2: '#F82D3A',
    red3: '#D60000',
    green1: '#27AE60',
    green2: '#27ae5f54',
    yellow1: '#ff9c0840',
    yellow2: '#FFE270',
    yellow3: '#F3841E',
    blue1: '#3B6A9C',
    blue2: '#2568af',
    white1: '#ffffff',
  }
}

export function theme(darkMode: boolean) {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  }
}

const fonts = {
  code: 'courier, courier new, serif',
}

const deprecated_mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(
  MEDIA_WIDTHS
).reduce((acc, size) => {
  acc[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `
  return acc
}, {} as any)

export const BREAKPOINTS = {
  xs: 396,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  xxxl: 1920,
}

const opacities = {
  hover: 0.6,
  click: 0.4,
  disabled: 0.5,
  enabled: 1,
}

function getSettings(darkMode: boolean) {
  return {
    grids: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '24px',
      xl: '32px',
    },
    fonts,

    // shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    deprecated_mediaWidth: deprecated_mediaWidthTemplates,

    navHeight: 72,
    mobileBottomBarHeight: 52,

    // deprecated - please use hardcoded exported values instead of
    // adding to the theme object
    breakpoint: BREAKPOINTS,
    opacity: opacities,
  }
}

export function getTheme(darkMode: boolean) {
  return {
    darkMode,
    ...(darkMode ? darkTheme : lightTheme),
    ...getSettings(darkMode),
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()
  // move all colors which are requested from the outside in a hook
  const dynamicColors = useThemeColors()
  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  const extendedTheme = {
    ...themeObject,
    ...dynamicColors,
  }

  // @ts-ignore
  return <StyledComponentsThemeProvider theme={extendedTheme}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  primary2(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary2'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow3'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  },
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-display: fallback;
}

html,
body {
  margin: 0;
  padding: 0;
}

a {
  color: ${colors(false).blue1};
}

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 18px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
}
`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: linear-gradient(180deg, var(--color-brand-background) 0%, rgba(255, 255, 255, 0) 100%);
}
`
