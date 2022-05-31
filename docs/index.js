console.log('index.js: loaded')

import Modal from './lib/modal.js'
import SubmitModal from './lib/submit-modal.js'

const init_modal = new SubmitModal('initModal')
init_modal.setButtonFunc(async () => {
  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    await DeviceOrientationEvent.requestPermission()
  }
})
init_modal.open()

// const modal_1 = new Modal('easyModal', () => {
//   console.log('aaa')
// })
// modal_1.open()
