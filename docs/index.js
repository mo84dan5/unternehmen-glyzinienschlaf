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

  // alias
  const [w, h] = [window.innerWidth, window.innerHeight]

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
  camera.position.set(0, 1, 0)
  scene.add(camera)
  const light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6)
  scene.add(light)
  const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
    antialias: true,
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(w, h)

  // 画面のクリックされた場所の先に描画されているオブジェクトのクリックイベントが発火するように設定
  renderer.domElement.addEventListener('click', (event) => {
    const vec = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      (event.clientY / window.innerHeight) * -2 + 1
    )
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(vec, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    // 1クリックでひとつのオブジェクトに対して多数の intersects が得られることがあるので、重複排除する
    const objects = Array.from(
      new Set(intersects.map((intersect) => intersect.object))
    )
    objects.forEach((object) => object.dispatchEvent({ type: 'click' }))
  })

  // カメラのコントロールをジャイロセンサーから取得した値と連携: THREE.DeviceOrientationControls
  const controls = new THREE.DeviceOrientationControls(camera, true)
  // DeviceOrientationControlsのデバイスごとのalpha値の違い吸収する
  window.addEventListener(
    'deviceorientation',
    function fixDeviceOrientationAlphaOffet(event) {
      const deg = event.alpha
      const rad = (((deg / 180 + 1) % 2) - 1) * Math.PI // deg2rad (-π 〜 π)
      controls.alphaOffset = -rad
    },
    { once: true }
  )

  // DOMにThreeJSのレンダラー(描画結果の出力)を追加
  document.body.appendChild(renderer.domElement)
  controls.connect()

  // 再生開始 (カメラ映像を投影)
  function loop() {
    requestAnimationFrame(loop)
    controls.update()
    renderer.render(scene, camera)
  }
  loop()
}
main()
// const modal_1 = new Modal('easyModal', () => {
//   console.log('aaa')
// })
// modal_1.open()
