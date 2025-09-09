import {
    defineNuxtModule,
    addPlugin,
    createResolver,
    addComponent,
    addVitePlugin
} from '@nuxt/kit'
import { defu } from 'defu'
import { name, version } from '../package.json'

export type VCalendarComponents = {
    DatePicker: boolean
    Calendar: boolean
}

interface DarkModeClassConfig {
    selector: string
    darkClass: string
}
type DarkModeConfig = boolean | 'system' | Partial<DarkModeClassConfig>
interface DatePickerPopoverDefaults {
    visibility?: string
    placement?: string
    isInteractive?: boolean
}
interface DatePickerDefaults {
    updateOnInput?: boolean
    inputDebounce?: number
    popover?: DatePickerPopoverDefaults
}
export interface Defaults {
    componentPrefix?: string
    color?: string
    isDark?: DarkModeConfig
    navVisibility?: string
    titlePosition?: string
    transition?: string
    touch?: object
    masks?: object
    locales?: any
    datePicker?: DatePickerDefaults
}
export interface ModuleOptions {
    /**
     * @description prefix instead of v-
     * @default V
     */
    prefix: string
    /**
     * @description load v-calendar styles
     * @default true
     */
    defaultCss: boolean
    /**
     * @description load custom stylesheet
     * @default undefined
     */
    cssPath?: string
    /**
     * @description v-calendar options
     * @see https://vcalendar.io/calendar/api.html#defaults
     */
    calendarOptions?: Defaults
    /**
     * @description auto import v-calendar components
     * @default '{ DatePicker: true, Calendar: true }'
     */
    autoImports: VCalendarComponents
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name,
        version,
        configKey: 'vcalendar',
    },
    defaults: {
        prefix: 'V',
        defaultCss: true,
        autoImports: {
            DatePicker: true,
            Calendar: true
        }
    },
    async setup(moduleOptions, nuxt) {
        const resolver = createResolver(import.meta.url)

        await import('@tailwindcss/vite').then((r) => addVitePlugin(r.default))


        const nuxtOptions = nuxt.options

        nuxt.options.runtimeConfig.public.vcalendar = defu(
            nuxt.options.runtimeConfig.public.vcalendar || {},
            moduleOptions
        )

        nuxtOptions.runtimeConfig.public.vcalendar ||= {}
        nuxtOptions.runtimeConfig.public.vcalendar = moduleOptions.calendarOptions

        nuxtOptions.build.transpile ||= []
        nuxtOptions.build.transpile.push('vcalendar')
        nuxtOptions.build.transpile.push('@popperjs/core')

        addPlugin(resolver.resolve('runtime/plugin.client'))

        if (moduleOptions.defaultCss) {
            nuxtOptions.css ||= []
            nuxtOptions.css.push(resolver.resolve(`./runtime/style.css`))
        }

        if (moduleOptions.cssPath) {
            nuxtOptions.css ||= []
            nuxtOptions.css.push(moduleOptions.cssPath)
        }

        if (moduleOptions.autoImports.DatePicker)
            addComponent({
                name: `${moduleOptions.prefix}DatePicker`,
                export: 'DatePicker',
                filePath: 'v-calendar'
            })

        if (moduleOptions.autoImports.Calendar)
            addComponent({
                name: `${moduleOptions.prefix}Calendar`,
                export: 'Calendar',
                filePath: 'v-calendar'
            })
    }
})

// Auto-generated type declarations
declare module '@nuxt/schema' {
    interface NuxtConfig {
        vcalendar?: Partial<ModuleOptions>
    }
}
