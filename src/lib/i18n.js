// Localisation
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locales from '../locales'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: locales
})

export default i18n
