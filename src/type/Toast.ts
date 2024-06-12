

export interface Toast {
  id: number | string,
  type: 'error' | 'success' | 'warn',
  isShown: boolean,
  content: string,
  height: number,
  keyboardOffsetTop: number,
  offsetTop: number,
  offsetGrid: number,
  duration: number,
  manuallyClose: boolean,
  needsSafeMarginBottom: boolean,
  buttonText: string,
  buttonOpenType: OpenType,
  buttonCallback: () => void
}

export enum Type {
  Warn = 'warn',
  Error = 'error',
  Success = "success"
}