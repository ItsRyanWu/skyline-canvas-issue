import mpx from '@mpxjs/core'
import { App } from '../type/App'

const app = getApp<App>()

export function formatPhoneNumber(number?: string) {
  if (!number) return ''
  // Split the number string into parts
  const part1 = number.slice(0, 3)
  const part2 = number.slice(3, 7)
  const part3 = number.slice(7, 11)

  // Concatenate the parts with hyphens
  const formattedNumber = `${part1}-${part2}-${part3}`

  return formattedNumber
}

export function getContext() {
  return new Promise((resolve, reject) => {
    wx.qy.getContext({
      success: (res: any) => {
        resolve(res)
      },
      fail: (res: any) => {
        reject(res)
      },
    })
  })
}

export function copy(content?: string) {
  if (!content) return app.showToast({
    content: '无内容可复制',
    type: 'warn',
    id: 'copy-no-content'
  })
  mpx.setClipboardData({
    data: content,
    success() {
      app.showToast({
        content: '复制成功',
        type: 'success',
        id: 'copy-success'
      })
    },
    fail(err) {
      app.showToast({
        content: '复制失败',
        type: 'error',
        id: 'copy-error'
      })
      console.error(err)
    },
  })
}