import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import themeService from 'shared/services/theme'
import { AppDispatch } from '../index'
import { useIsDarkMode } from './hooks'
import { updateMatchesDarkMode } from './actions'

export default function Updater(): null {
  const dispatch = useDispatch<AppDispatch>()
  const isDark = useIsDarkMode()

  // keep html class for CSS theme switching in sync with React state
  useEffect(() => {
    themeService.setBodyThemeScheme({ isDark })
  }, [isDark])

  // keep dark mode in sync with the system
  useEffect(() => {
    const darkHandler = (match: MediaQueryListEvent) => {
      dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))
    }

    const match = window?.matchMedia('(prefers-color-scheme: dark)')
    dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))

    if (match?.addListener) {
      match?.addListener(darkHandler)
    } else if (match?.addEventListener) {
      match?.addEventListener('change', darkHandler)
    }

    return () => {
      if (match?.removeListener) {
        match?.removeListener(darkHandler)
      } else if (match?.removeEventListener) {
        match?.removeEventListener('change', darkHandler)
      }
    }
  }, [dispatch])

  return null
}
