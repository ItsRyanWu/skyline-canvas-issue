const { defineConfig } = require('unocss')
const presetMpx = require('@mpxjs/unocss-base')

const remRE = /(-?[.\d]+)rem/g
const pxRE = /(-?[.\d]+)px/g

module.exports = defineConfig({
  presets: [presetMpx({ baseFontSize: 32 })],
  // Hack, for enabling unocss vscode IntelliSense extension
  content: {
    pipeline: {
      include: [/\.mpx($|\?)/],
    },
  },
  theme: {
    colors: {
      black: '#171717',
      pureBlack: '#000000',
    },
    letterSpacing: {
      normal: '0',
      wide: '1px',
      wider: '1.5px',
      widest: '2px',
    },
    fontFamily: {
      gotham: [
        'Gotham',
        '-apple-system,BlinkMacSystemFont,PingFang SC,Hiragino Sans GB,noto sans,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif',
      ],
    },
    animation: {
      skeleton: 'skeleton-flicker 1.5s ease-in infinite alternate',
    },
  },
  postprocess(util) {
    util.entries.forEach(i => {
      const value = i[1]
      if (value && typeof value === 'string') {
        switch (true) {
          case remRE.test(value):
            i[1] = value.replace(remRE, (_, p1) => `${p1 * 16 * 2}rpx`)
            break
          case pxRE.test(value):
            i[1] = value.replace(pxRE, (_, p1) => `${p1 * 2}rpx`)
            break
          default:
            break
        }
      }
    })
  },
  safelist: [],
})
