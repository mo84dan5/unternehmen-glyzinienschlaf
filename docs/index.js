console.log('index.js: loaded')

import Modal from './lib/modal.js'
import SubmitModal from './lib/submit-modal.js'

async function requestPermission() {
  const init_modal = new SubmitModal('initModal')
  init_modal.setButtonFunc(async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      await DeviceOrientationEvent.requestPermission()
      resolve()
    }
  })
  init_modal.open()
}
async function main() {
  await requestPermission()
  const scene = new THREE.Scene()
}
main()
// const modal_1 = new Modal('easyModal', () => {
//   console.log('aaa')
// })
// modal_1.open()
