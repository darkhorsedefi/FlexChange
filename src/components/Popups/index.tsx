import React from 'react'
import styled from 'styled-components'
import { useActivePopups, useAppState } from 'state/application/hooks'
import { AppState } from 'state'
import { useSelector } from 'react-redux'
import { AutoColumn } from '../Column'
import PopupItem from './PopupItem'

const MobilePopupWrapper = styled.div<{ height: string | number }>`
  position: fixed;
  z-index: 300;
  max-width: 100%;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? '0 auto;' : 0)};
  margin-bottom: ${({ height }) => (height ? '20px' : 0)}};
  display: none;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
    padding-top: 20px;
  `};
`

const MobilePopupInner = styled.div`
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`

const FixedPopupColumn = styled(AutoColumn)<{ noPadding: boolean; extraPadding: boolean }>`
  position: fixed;
  top: ${({ noPadding, extraPadding }) => (noPadding ? '22px' : extraPadding ? '72px' : '64px')};
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 300;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export default function Popups() {
  const { admin } = useAppState()
  const activePopups = useActivePopups()

  const appManagement = useSelector<AppState, AppState['application']['appManagement']>(
    (state) => state.application.appManagement
  )

  const noDomainInfo = !admin

  return (
    <>
      <FixedPopupColumn gap="20px" noPadding={appManagement || noDomainInfo} extraPadding={false}>
        {activePopups.map((item) => (
          <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
        ))}
      </FixedPopupColumn>
      {activePopups?.length > 0 && (
        <MobilePopupWrapper height="fit-content">
          <MobilePopupInner>
            {activePopups // reverse so new items up front
              .slice(0)
              .reverse()
              .map((item) => (
                <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
              ))}
          </MobilePopupInner>
        </MobilePopupWrapper>
      )}
    </>
  )
}
