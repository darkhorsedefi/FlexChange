import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Trash2, Power, ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { shortenAddress } from 'utils'
import { injected } from 'utils/wallet'
import { useActiveWeb3React } from 'hooks'
import { useAppState } from 'state/application/hooks'
import { setAppManagement } from 'state/application/actions'
import IconButton from 'components/IconButton'
import { STORAGE_NETWORK_NAME, STORAGE_NETWORK_ID } from '../../constants'
import networks from 'networks.json'

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledIconButton = styled(IconButton)`
  :not(:last-child) {
    margin-right: 8px;
  }
`

const NetworkInfo = styled.div`
  .row {
    margin: 0.6rem 0;
    display: flex;
    justify-content: space-between;
  }
`

const Error = styled.span`
  display: inline-block;
  width: 100%;
  margin: 0.6rem 0 0.2rem;
  padding: 0.4rem;
  overflow-x: auto;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.red1};
`

export default function PanelHeader({
  setPending,
  setShowConfirm,
  pending,
  setError,
  error,
}: {
  setPending: (v: any) => void
  pending: boolean
  setError: (v: any) => void
  error: any
  setShowConfirm: (v: boolean) => void
}) {
  const { t } = useTranslation()
  const { account, chainId, deactivate, activate } = useActiveWeb3React()
  const dispatch = useDispatch()
  const { admin } = useAppState()

  const backToApp = () => {
    dispatch(setAppManagement({ status: false }))
  }

  const activateWallet = useCallback(
    (connector: any) => {
      setPending(true)
      setError(false)

      activate(connector, undefined, true)
        .catch(setError)
        .finally(() => setPending(false))
    },
    [activate, setError, setPending]
  )

  useEffect(() => {
    injected.isAuthorized().then((authorized: any) => {
      if (authorized) {
        activateWallet(injected)
      }
    })
  }, [activateWallet])

  //@ts-ignore
  const accountPrefix = networks[chainId]?.name || t('account')

  return (
    <div>
      <HeaderButtons>
        <StyledIconButton onClick={backToApp} Icon={ArrowLeft}>
          {t('back')}
        </StyledIconButton>
        <StyledIconButton onClick={deactivate} Icon={Power}>
          {t('disconnect')}
        </StyledIconButton>
        {Boolean(admin?.toLowerCase() === account?.toLowerCase() && chainId === STORAGE_NETWORK_ID) && (
          <StyledIconButton onClick={() => setShowConfirm(true)} Icon={Trash2}>
            {t('resetDomainData')}
          </StyledIconButton>
        )}
      </HeaderButtons>

      {account && (
        <NetworkInfo>
          <div className="row">
            {t('storageNetwork')}: <span>{STORAGE_NETWORK_NAME}</span>
          </div>
          <div className="row">
            {accountPrefix ? `${accountPrefix}: ` : ' '}
            <span className="monospace">{shortenAddress(account)}</span>
          </div>
        </NetworkInfo>
      )}

      {error && (
        <Error>
          {error?.code && error.code + ': '}
          {error?.message}
        </Error>
      )}
    </div>
  )
}
