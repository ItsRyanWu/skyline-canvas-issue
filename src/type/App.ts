import { Toast } from './Toast'

export interface App {

  showToast(option: string | Partial<Toast>): void

  hideToast(id: string | number): void

}