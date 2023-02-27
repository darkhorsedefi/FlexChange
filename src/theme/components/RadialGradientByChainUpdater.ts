import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { useDarkModeManager } from 'state/user/hooks'
import networks from 'networks.json'

const initialStyles = {
  width: '200vw',
  height: '200vh',
  transform: 'translate(-50vw, -100vh)',
}
const backgroundResetStyles = {
  width: '100vw',
  height: '100vh',
  transform: 'unset',
}

type TargetBackgroundStyles = typeof initialStyles | typeof backgroundResetStyles

const backgroundRadialGradientElement = document.getElementById('background-radial-gradient')

const setBackground = (newValues: TargetBackgroundStyles) =>
  Object.entries(newValues).forEach(([key, value]) => {
    if (backgroundRadialGradientElement) {
      backgroundRadialGradientElement.style[key as keyof typeof backgroundResetStyles] = value
    }
  })

export default function RadialGradientByChainUpdater(): null {
  const { chainId } = useWeb3React()
  const [darkMode] = useDarkModeManager()

  useEffect(() => {
    if (!backgroundRadialGradientElement) return

    let lightGradient: string
    let darkGradient: string

    switch (chainId) {
      case networks['1'].chainId: {
        setBackground(backgroundResetStyles)
        const { colorSoft } = networks['1']
        lightGradient = `radial-gradient(100% 100% at 50% 0%, ${colorSoft} 0%, rgba(200, 168, 255, 0.05) 49.48%, var(--color-gradient-background-end-light) 100%), #FFFFFF`
        darkGradient = `radial-gradient(100% 100% at 50% 0%, ${colorSoft} 0%, var(--color-gradient-background-end-dark) 49.48%, rgba(31, 33, 40, 0) 100%), #0D0E0E`
        break
      }
      case networks['56'].chainId:
      case networks['97'].chainId: {
        setBackground(backgroundResetStyles)
        const { colorSoft } = networks['56']
        lightGradient = `radial-gradient(100% 100% at 50% 0%, ${colorSoft} 0%, rgba(200, 168, 255, 0.05) 49.48%, var(--color-gradient-background-end-light) 100%), #FFFFFF`
        darkGradient = `radial-gradient(100% 100% at 50% 0%, ${colorSoft} 0%, var(--color-gradient-background-end-dark) 49.48%, rgba(31, 33, 40, 0) 100%), #0D0E0E`
        break
      }
      case networks['137'].chainId:
      case networks['80001'].chainId: {
        setBackground(backgroundResetStyles)
        const { colorSoft } = networks['137']
        lightGradient = `radial-gradient(100% 100% at 50% 0%, ${colorSoft} 0%, rgba(200, 168, 255, 0.05) 49.48%, var(--color-gradient-background-end-light) 100%), #FFFFFF`
        darkGradient = `radial-gradient(100% 100% at 50% 0%, ${colorSoft} 0%, var(--color-gradient-background-end-dark) 49.48%, rgba(31, 33, 40, 0) 100%), #0D0E0E`
        break
      }
      default: {
        setBackground(initialStyles)
        lightGradient =
          'radial-gradient(100% 100% at 50% 0%, var(--color-brand-gradient-background) 0%, var(--color-page-background) 100%), #FFFFFF'
        darkGradient =
          'linear-gradient(180deg, var(--color-brand-gradient-background) 0%, var(--color-page-background) 100%)'
      }
    }

    backgroundRadialGradientElement.style.background = darkMode ? darkGradient : lightGradient
  }, [darkMode, chainId])

  return null
}
