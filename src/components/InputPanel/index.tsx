import React, { useContext, useCallback } from 'react'
import styled, { ThemeContext, css } from 'styled-components'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'

const InputPanel = styled.div<{ error?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  background-color: var(--color-background-module);
  color: var(--color-text-primary);
  border-radius: 12px;
  padding: 8px 0;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  transition: height 1s ease;
  will-change: height;
  z-index: 1;
  width: 100%;

  &:before {
    box-sizing: border-box;
    background-size: 100%;
    border-radius: inherit;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    pointer-events: none;
    content: '';
    border: 1px solid var(--color-background-module);
  }

  &:hover:before {
    border-color: var(--color-state-overlay-hover);
  }

  &:focus-within:before {
    border-color: var(--color-state-overlay-pressed);
  }

  ${({ error }) =>
    error &&
    css`
      &:before {
        border: 1px solid var(--color-f-error);
      }
    `};
`

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`

const Input = styled.input<{ disabled: boolean }>`
  outline: none;
  border: none;
  width: 100%;
  padding: 0px;
  flex: 1 1 auto;
  background-color: transparent;
  transition: color 300ms step-start;
  color: ${({ theme }) => theme.text1};
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.25rem;
  font-weight: 500;

  ${({ disabled }) => (disabled ? 'opacity: 0.5' : '')};

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

export default function AddressInputPanel({
  id,
  label,
  disabled = false,
  type = 'text',
  min,
  max,
  step,
  value,
  onChange,
  error,
}: {
  id?: string
  label?: string
  disabled?: boolean
  type?: string
  min?: number
  max?: number
  step?: number
  error?: boolean
  value: string | number
  onChange?: (value: string) => void
}) {
  const theme = useContext(ThemeContext)

  const handleInput = useCallback(
    (event) => {
      if (typeof onChange === 'function') {
        const input = event.target.value
        const withoutSpaces = input.replace(/\s+/g, '')
        onChange(withoutSpaces)
      }
    },
    [onChange]
  )

  return (
    <InputPanel id={id} error={error}>
      <InputContainer>
        <AutoColumn gap="md">
          {label && (
            <RowBetween>
              <TYPE.black color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.black>
            </RowBetween>
          )}
          <Input
            disabled={disabled}
            type={type}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="..."
            onChange={disabled ? () => {} : handleInput}
            value={value}
            min={min}
            max={max}
            step={step}
          />
        </AutoColumn>
      </InputContainer>
    </InputPanel>
  )
}
