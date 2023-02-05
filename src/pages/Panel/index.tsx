import React, { useEffect, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import styled from 'styled-components'
import { getCurrentDomain } from 'utils/app'
import { Text } from 'rebass'
import networks from 'networks.json'
import { SUPPORTED_NETWORKS } from 'connectors'
import { STORAGE_NETWORK_ID } from '../../constants'
import { resetAppData } from 'utils/storage'
import useWordpressInfo from 'hooks/useWordpressInfo'
import { useTranslation } from 'react-i18next'
import { ButtonError } from 'components/Button'
import ConfirmationModal from 'components/ConfirmationModal'
import SwapContracts from './SwapContracts'
import Interface from './Interface'
import Migration from './Migration'
import PanelHeader from './PanelHeader'

export const PartitionWrapper = styled.div<{ highlighted?: boolean }>`
  margin-top: 1rem;

  ${({ highlighted, theme }) =>
    highlighted ? `border-radius: .6rem; padding: 0.2rem; border: 1px solid ${theme.bg3};` : ''}
`

export const OptionWrapper = styled.div<{ margin?: number; flex?: boolean }>`
  margin: ${({ margin }) => margin || 0.2}rem 0;
  padding: 0.3rem 0;

  ${({ flex }) => (flex ? 'display: flex; align-items: center; justify-content: space-between' : '')}
`

const Wrapper = styled.section`
  position: relative;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 8px;
  border-radius: var(--main-component-border-radius);
  border: 1px solid var(--color-background-outline);
  background-color: var(--color-background-surface);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90%;
  `}
`

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.bg3};
`

const Tab = styled.button<{ active?: boolean }>`
  flex: 1;
  cursor: pointer;
  padding: 0.4rem 0.7rem;
  //margin: 0.1rem 0 0.4rem;
  font-size: 1em;
  border: none;
  background-color: ${({ theme, active }) => (active ? theme.bg2 : 'transparent')};
  color: ${({ theme }) => theme.text1};

  :first-child {
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  :last-child {
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
  }
`

const Content = styled.div`
  border-radius: 1rem;
`

interface ComponentProps {
  setDomainDataTrigger: (x: any) => void
}

export default function Panel({ setDomainDataTrigger }: ComponentProps) {
  const { t } = useTranslation()
  const [pending, setPending] = useState<boolean>(false)
  const { chainId, account, library } = useActiveWeb3React()
  const wordpressData = useWordpressInfo()
  const [error, setError] = useState<any>(false)
  const [domain] = useState(getCurrentDomain())
  const [activeNetworks, setActiveNetworks] = useState<any[]>([])

  useEffect(() => {
    if (wordpressData) {
      const networks = Object.values(SUPPORTED_NETWORKS).filter(({ chainId }) =>
        wordpressData?.wpNetworkIds?.length ? wordpressData.wpNetworkIds.includes(chainId) : true
      )

      setActiveNetworks(networks)
    } else {
      setActiveNetworks(Object.values(SUPPORTED_NETWORKS))
    }
  }, [wordpressData])

  const [wrappedToken, setWrappedToken] = useState('')

  useEffect(() => {
    if (chainId) {
      //@ts-ignore
      setWrappedToken(networks[chainId]?.wrappedToken?.address)
    }
  }, [chainId])

  const [tab, setTab] = useState('contracts')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  const resetData = async () => {
    setShowConfirm(false)

    await resetAppData({ library, owner: account || '' })

    setDomainDataTrigger((state: boolean) => !state)
  }

  const returnTabs = () => {
    const tabs = [
      { tabKey: 'contracts', tabName: 'swapContracts' },
      { tabKey: 'interface', tabName: 'interface' },
    ]

    if (chainId === STORAGE_NETWORK_ID) {
      tabs.push({ tabKey: 'migration', tabName: 'migration' })
    }

    return tabs.map((info, index) => {
      return (
        <Tab key={index} active={tab === info.tabKey} onClick={() => setTab(info.tabKey)}>
          {t(info.tabName)}
        </Tab>
      )
    })
  }

  return (
    <Wrapper>
      <ConfirmationModal
        isOpen={showConfirm}
        onDismiss={() => setShowConfirm(false)}
        content={() => (
          <>
            <Text fontWeight={500} fontSize={20}>
              {t('resetDomainDescription')}
            </Text>
            <ButtonError error padding={'12px'} onClick={resetData}>
              <Text fontSize={20} fontWeight={500} id="reset">
                {t('resetDomainData')}
              </Text>
            </ButtonError>
          </>
        )}
      />
      <PanelHeader
        setPending={setPending}
        pending={pending}
        setError={setError}
        error={error}
        setShowConfirm={setShowConfirm}
      />
      <Tabs>{returnTabs()}</Tabs>
      <Content>
        {tab === 'contracts' && (
          <SwapContracts
            domain={domain}
            pending={pending}
            setPending={setPending}
            setError={setError}
            wrappedToken={wrappedToken}
          />
        )}
        {tab === 'interface' && (
          <Interface
            domain={domain}
            pending={pending}
            activeNetworks={activeNetworks}
            setPending={setPending}
            setError={setError}
          />
        )}
        {tab === 'migration' && <Migration />}
      </Content>
    </Wrapper>
  )
}
