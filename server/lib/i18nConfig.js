import i18n from 'i18n'
import path from 'path'

const options = {
  locales: ['en', 'es'],
  directory: path.join(__dirname, '../../locales'),
  defaultLocale: 'en',
  cookie: 'locale-lang',
  autoReload: true, // watch for changes in JSON files to reload locale - default: false
  syncFiles: true, // sync locale info across all files - default: false
}

i18n.configure(options)

// Config para i18n desde scripts CLI
i18n.setLocale('en')

export default i18n
