const setBodyThemeScheme = ({ isDark }: { isDark: boolean }) => {
  document.body.dataset.scheme = isDark ? 'dark' : 'default'
}

export default {
  setBodyThemeScheme,
}
