import { css } from 'styled-components/macro'

export const ScrollBarStyles = css<{ $isHorizontalScroll?: boolean }>`
  // Firefox scrollbar styling
  scrollbar-width: thin;
  scrollbar-color: var(--color-background-outline) transparent;
  height: 100%;

  // safari and chrome scrollbar styling
  ::-webkit-scrollbar {
    background: transparent;

    // Set height for horizontal scrolls
    ${({ $isHorizontalScroll }) => {
      return $isHorizontalScroll
        ? css`
            height: 4px;
            overflow-x: scroll;
          `
        : css`
            width: 4px;
            overflow-y: scroll;
          `
    }}
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-background-outline);
    border-radius: 8px;
  }
`

export const OpacityHoverState = css`
  &:hover {
    opacity: 0.6;
  }

  &:active {
    opacity: 0.4;
  }

  transition: opacity 250ms ease;
`