import React from 'react'
import styled from 'styled-components'
import Settings from '../Settings'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../Row'
import { TYPE } from 'theme'

const StyledSwapHeader = styled.div`
  padding: 8px 12px;
  margin-bottom: 8px;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`

export default function SwapHeader() {
  const { t } = useTranslation()

  return (
    <StyledSwapHeader>
      <RowBetween>
        <TYPE.black fontWeight={500}>{t('swap')}</TYPE.black>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  )
}
