import { createEventBus, slot } from 'ts-event-bus'
import { Toast } from "../type/Toast"

const myEvents = {
  showToast: slot<Partial<Toast> | string>(),
  hideToast: slot<Partial<Toast>>()
}

export default createEventBus({
  events: myEvents
})