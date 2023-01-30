import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Check } from 'react-feather'
import i18n, { availableLanguages, LANG_NAME } from '../../i18n'
import { MenuFlyout, StyledMenuHeader, ReturnButton, ClickableMenuItem } from './styled'

export default function LangMenu({ close }: { close: VoidFunction }) {
  const { t } = useTranslation()

  return (
    <MenuFlyout>
      <StyledMenuHeader>
        <ReturnButton onClick={close}>
          <ChevronLeft size={22} color="var(--color-text-secondary)" />
        </ReturnButton>
        {t('language')}
      </StyledMenuHeader>

      {availableLanguages.map((lang) => (
        <ClickableMenuItem key={lang} onClick={() => i18n.changeLanguage(lang)}>
          {LANG_NAME[lang] || lang.toUpperCase()}
          {i18n.language === lang && <Check color="var(--color-accent-active)" opacity={1} size={20} />}
        </ClickableMenuItem>
      ))}
    </MenuFlyout>
  )
}
