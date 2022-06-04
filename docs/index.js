console.log('index.js: loaded')

import Modal from './lib/modal.js'
import SubmitModal from './lib/submit-modal.js'

function requestPermission() {
  return new Promise(async (resolve) => {
    const modal = document.getElementById('initModal')
    console.log(modal)
    const funcButton = modal.getElementsByClassName('button')[0]
    modal.style.display = 'block'
    funcButton.addEventListener('click', async () => {
      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function'
      ) {
        await DeviceOrientationEvent.requestPermission()
      }
      modal.style.display = 'none'
      resolve()
    })
  })
}
async function main() {
  await requestPermission()

  // ThreeJSのレンダラーを用意
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 1, 4)
  scene.add(camera)
  const light = new THREE.AmbientLight(0x808080)
  scene.add(light)
  const spotLight = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 4, 1, 50)
  spotLight.position.copy(camera.position)
  spotLight.quaternion.copy(camera.quaternion)
  spotLight.castShadow = true
  scene.add(spotLight)
  const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
    antialias: true,
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
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

  // 画面のクリックされた場所の先に描画されているオブジェクトのクリックイベントが発火するように設定
  renderer.domElement.addEventListener('click', (event) => {
    const vec = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      (event.clientY / window.innerHeight) * -2 + 1
    )
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(vec, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    // intersects の重複排除
    const objects = Array.from(
      new Set(intersects.map((intersect) => intersect.object))
    )
    objects.forEach((object) => object.dispatchEvent({ type: 'click' }))
  })

  // 再生開始 (カメラ映像を投影)
  function loop() {
    requestAnimationFrame(loop)
    controls.update()
    spotLight.position.copy(camera.position)
    spotLight.quaternion.copy(camera.quaternion)
    spotLight.rotation.copy(camera.rotation)
    renderer.render(scene, camera)
  }
  loop()

  // ここから作成

  function makefloor() {
    const geometry = new THREE.BoxGeometry(2000, 0.1, 2000)
    const material = new THREE.MeshToonMaterial({ color: 0x00aa00 })
    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    return floor
  }
  const floor = makefloor()
  scene.add(floor)

  function makeCube() {
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshToonMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.y = 1
    cube.receiveShadow = true
    return cube
  }
  const cube = makeCube()
  scene.add(cube)
}
main()
