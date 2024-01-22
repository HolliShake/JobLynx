import { breakpointsVuetify } from '@vueuse/core'
import { VIcon } from 'vuetify/components/VIcon'

// ❗ Logo SVG must be imported with ?raw suffix
import { avatarText } from '@/@core/utils/formatters'
import { defineThemeConfig } from '@core'
import { RouteTransitions, Skins } from '@core/enums'
import logo from '@images/trace.svg'
import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from '@layouts/enums'
import { h } from 'vue'

const title = import.meta.env.VITE_APP_NAME

const logoManpower = h('img', { src: logo, style: 'width: 52px !important;' })

export const { themeConfig, layoutConfig } = defineThemeConfig({
  app: {
    title: (title.length >= 8)? avatarText(title) : title,
    logo: h('div', { style: 'line-height:0; color: rgb(var(--v-global-theme-primary))' }, [
      logoManpower,
    ]),
    contentWidth: ContentWidth.Boxed,
    contentLayoutNav: AppContentLayoutNav.Vertical,
    overlayNavFromBreakpoint: breakpointsVuetify.md + 16,
    enableI18n: false,
    theme: 'dark',
    isRtl: false,
    skin: Skins.Default,
    routeTransition: RouteTransitions.Fade,
    iconRenderer: VIcon,
  },
  navbar: {
    type: NavbarType.Sticky,
    navbarBlur: true,
  },
  footer: { type: FooterType.Static },
  verticalNav: {
    isVerticalNavCollapsed: false,
    defaultNavItemIconProps: { icon: 'tabler-circle', size: 10 },
    isVerticalNavSemiDark: false,
  },
  horizontalNav: {
    type: 'sticky',
    transition: 'slide-y-reverse-transition',
  },
  icons: {
    chevronDown: { icon: 'tabler-chevron-down' },
    chevronRight: { icon: 'tabler-chevron-right', size: 18 },
    close: { icon: 'tabler-x' },
    verticalNavPinned: { icon: 'tabler-circle-dot' },
    verticalNavUnPinned: { icon: 'tabler-circle' },
    sectionTitlePlaceholder: { icon: 'tabler-separator' },
  },
})
