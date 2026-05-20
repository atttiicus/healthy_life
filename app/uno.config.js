const { defineConfig, presetUno } = require('unocss')

module.exports = defineConfig({
  // @unocss/postcss 需要知道扫哪些文件
  content: {
    filesystem: [
      'src/**/*.vue',
      'src/**/*.js',
    ],
  },
  presets: [presetUno()],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#10b981',
        50:  '#ecfdf5',
        100: '#d1fae5',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
      },
    },
  },
  shortcuts: [
    ['card',       'bg-white rounded-2xl'],
    ['page',       'min-h-screen bg-[#f5f7fa]'],
    ['sec-title',  'text-base font-semibold text-[#1f2937]'],
    ['input-wrap', 'flex items-center border border-[#e5e7eb] rounded-xl px-4 h-12 bg-[#f9fafb]'],
    ['btn-green',  'h-12 rounded-xl flex items-center justify-center bg-[#10b981] active:opacity-80'],
    ['tag-green',  'bg-[#ecfdf5] rounded-full px-2 py-0.5'],
  ],
})
