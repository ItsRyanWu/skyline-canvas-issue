import mpx from '@mpxjs/core'
import mpxFetch from '@mpxjs/fetch'
import { App } from '../type/App'
// eslint-disable-next-line
const gql = require('nanographql')
mpx.use(mpxFetch)

export enum StorageKey {
  Token = 'token',
  TokenExpiration = 'tokenExpiration',
  DeclineCGIDate = 'declineCGIDate'
}

export interface Options {
  endPoint: string,
  app: App
}

export enum ToastType {
  Warn = 'warn',
  Error = 'error',
  Success = "success"
}

export function isObject(object: unknown) {
  return object?.toString() === '[object Object]'
}

export interface GraphqlResponseInterface<T> {
  data: T
  errors: Array<{
    message: string,
    code?: number
  }>
}

export interface Response<T> {
  data: T
  statusCode: string
}

export enum MutationName {
  MiniProgramToken = 'miniProgramToken',
}


export class Base {

  private endPoint: string

  public app: App

  private token: string
  private tokenExpiration: number

  constructor(options: Options) {

    const { endPoint, app } = options

    this.endPoint = endPoint
    this.app = app

  }


  public async login(): Promise<Login | undefined> {

    try {

      const code = await this.loginWechat() as string

      if (code) {


        const result = await this.loginBackend(code)


        if (result) {


          const expiredTime = Date.now() + result.expiresIn * 60 * 1000

          this.persistTokenExpiration(expiredTime)
          this.persistToken(result.token)
          this.token = result.token

          return result

        }

      }

    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }

  }

  private async getSignedHeaders() {

    try {

      const tokenExpiration = this.getCachedTokenExpiration()

      if (!tokenExpiration || Date.now() > tokenExpiration) {

        this.app.showToast({
          content: 'DDC 登录已过期，正在自动重新登录',
          id: 're-login'
        })

        await this.login()

      }

      const token = this.getCachedToken()

      if (!token) {

        this.app.showToast({
          content: '无可用 token',
          id: 'login-first'
        })
        throw new Error('No token can be used')

      }

      return {
        Authorization: `Bearer ${token}`
      }


    } catch (error) {

      return Promise.reject(error)

    }

  }

  public persistToken(token: string) {

    this.token = token

    wx.setStorageSync(StorageKey.Token, token)

  }

  public removeCachedToken() {

    this.token = ''
    this.tokenExpiration = 0
    wx.removeStorageSync(StorageKey.Token)
    wx.removeStorageSync(StorageKey.TokenExpiration)

  }

  public persistTokenExpiration(expiredIn: number) {

    this.tokenExpiration = expiredIn
    wx.setStorageSync(StorageKey.TokenExpiration, expiredIn)

  }

  private getCachedToken() {

    if (this.token) {
      return this.token
    } else {
      return mpx.getStorageSync(StorageKey.Token)
    }

  }

  private getCachedTokenExpiration() {

    if (this.tokenExpiration) {
      return this.tokenExpiration
    } else {
      return mpx.getStorageSync(StorageKey.TokenExpiration)
    }

  }

  public loginWechat() {

    return new Promise((resolve, reject) => {

      wx.qy.login({
        fail: (error: any) => {
          this.app.showToast({
            content: '微信登录失败',
            manuallyClose: true,
            type: ToastType.Error
          })
          reject(error)
        },
        success: ({ code }: { code: string }) => resolve(code)
      })

    })
  }

  public loginBackend(code: string) {
    const query = gql`
            mutation miniProgramToken($code: String!) {
                miniProgramToken(code: $code) {
                 token
                 expiresIn
                }
            }
        `

    return this.request<Login>(query({ code }), MutationName.MiniProgramToken, false)
  }

  protected request<T>(queryData: string, actionName: string | string[], withAuth = true, operationName?: string): Promise<T> {

    const data = JSON.parse(queryData)

    if (operationName) {
      data.operationName = operationName
    }

    return new Promise((resolve, reject) => {

      const option: WechatMiniprogram.RequestOption<GraphqlResponseInterface<T>> = {

        url: this.endPoint,

        method: 'POST',

        data,

        header: {
          Accept: 'application/json'
        },

        fail: error => {

          console.error(error)

          const errMsg = error.errMsg

          this.app.showToast({
            content: errMsg,
            duration: 5000,
            type: ToastType.Error,
            id: errMsg
          })

          reject(error)

        },

        success: (response) => {

          const data = response.data

          if (!data || !isObject(data)) {

            this.app.showToast({
              content: `请求出现错误：${response.statusCode}`,
              id: response.statusCode,
              manuallyClose: true,
              type: ToastType.Error
            })

            return reject(response.statusCode)

          }


          if (data.errors) {

            console.error(data.errors)

            data.errors.forEach((error) => {

              let inDepthMessages: Array<string> | null = null

              if (error.message === 'validation') {

                // /* eslint-disable */
                const validationDetailedMessages = (error as any).extensions?.validation

                if (validationDetailedMessages) {

                  inDepthMessages = Object.values(validationDetailedMessages).map(item => (item as Array<string>).join(''))

                }

              }

              if (inDepthMessages?.length) {

                for (const message of inDepthMessages) {

                  this.app.showToast({
                    content: message || `请求出现错误：${error.code}`,
                    id: message,
                    manuallyClose: true,
                    type: ToastType.Error
                  })

                }

              } else {

                this.app.showToast({
                  content: error.message || `请求出现错误：${error.code}`,
                  id: error.message || error.code,
                  manuallyClose: true,
                  type: ToastType.Error
                })

              }

            })

            reject(data.errors)

          }

          if (data.data) {

            if (Array.isArray(actionName)) {

              resolve(data.data as T)

            } else if (typeof actionName === 'string') {

              resolve((data.data as any)[actionName] as T)

            }

          } else {

            reject(new Error('接收到的数据为空'))

          }

        }

      }

      if (withAuth) {

        this.getSignedHeaders()
          .then((token) => {
            option.header = { ...option.header, ...token }
            mpx.xfetch.fetch(option)
          })
          .catch((error) => {
            reject(error)
          })

      } else {

        mpx.xfetch.fetch(option)

      }

    })

  }

}