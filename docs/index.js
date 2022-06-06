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
function makeObject(position, color, geometry) {
  const material = new THREE.MeshToonMaterial({ color: color })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = position[0]
  mesh.position.y = position[1]
  mesh.position.z = position[2]
  mesh.receiveShadow = true
  const outline = new THREE.Mesh(
    geometry,
    new THREE.MeshToonMaterial({ color: 0x000000 })
  )
  outline.material.side = THREE.BackSide
  outline.position.copy(mesh.position)
  outline.flipSided = true
  outline.scale.x = 1.01
  outline.scale.y = 1.01
  outline.scale.z = 1.01
  const group = new THREE.Group()
  group.add(mesh)
  group.add(outline)
  return group
}

function tweenSlide(obj, tgtPositon) {
  const twAnim1 = new TWEEN.Tween(obj.position)
    .to({ x: tgtPositon.x, z: tgtPositon.z }, 1000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {})
    .onComplete(() => {})
  const twAnim2 = new TWEEN.Tween(obj.position)
    .to({ y: tgtPositon.y + 5 + 2 }, 500)
    .easing(TWEEN.Easing.Cubic.In)
    .onComplete(() => {})
  const twAnim3 = new TWEEN.Tween(obj.position)
    .to({ y: tgtPositon.y + 2 }, 500)
    .easing(TWEEN.Easing.Cubic.Out)
    .onComplete(() => {})

  twAnim1.start()
  twAnim2.chain(twAnim3)
  twAnim2.start()
}

function movingBall(px, py, pz, scene, camera) {
  const geometry = new THREE.SphereGeometry(3, 32, 32)
  const material = new THREE.MeshToonMaterial({ color: 0x00ff00 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(px, py, pz)
  material.transparent = true
  material.opacity = 0.5
  mesh.addEventListener('click', () => {
    tweenSlide(camera, mesh.position)
  })
  scene.add(mesh)
  return mesh
}

function makeTree() {
  const obj1 = makeObject(
    [0, 6, 0],
    0x00ff00,
    new THREE.SphereGeometry(4, 32, 32)
  )
  const obj2 = makeObject(
    [0, 2.5, 0],
    0xcd853f,
    new THREE.CylinderGeometry(1, 1, 5, 32)
  )
  const group = new THREE.Group()
  group.add(obj1)
  group.add(obj2)
  return group
}

async function main() {
  await requestPermission()

  let nyoronyoroCoin = 0
  const contentsPromises = []

  const texture01_nyoro = new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      './img/nyoro.png',
      resolve,
      undefined,
      reject
    )
  })
  contentsPromises.push(texture01_nyoro)
  await Promise.all(contentsPromises)

  // ThreeJSのレンダラーを用意
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 1.5, 6)
  scene.add(camera)
  const light = new THREE.AmbientLight(0x808080)
  scene.add(light)
  const dlight = new THREE.DirectionalLight(0xffffff, 0.3)
  const t = Date.now() / 500
  const r = 10.0
  const lx = r * Math.cos(t)
  const lz = r * Math.sin(t)
  const ly = 6.0 + 5.0 * Math.sin(t / 3.0)
  dlight.position.set(lx, ly, lz)
  scene.add(dlight)

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
    const tgtObj = intersects[0].object
    // intersects の重複排除
    const objects = Array.from(
      new Set(intersects.map((intersect) => intersect.object))
    )
    console.log(objects)
    objects.forEach((object) => {
      if (object === tgtObj) object.dispatchEvent({ type: 'click' })
    })
    // objects[0].dispatchEvent({ type: 'click' })
  })

  // 再生開始 (カメラ映像を投影)
  function loop() {
    // console.log(camera.quaternion)
    TWEEN.update()
    requestAnimationFrame(loop)
    controls.update()
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

  // ---- 1階の制作 ---- //
  const floor1st = [
    [90, 20, 45, -110],
    [20, 200, 10, -200],
    [90, 20, 45, -290],
    [20, 60, 80, -310],
    [60, 20, 100, -330],
    [20, 60, 120, -310],
    [90, 20, 155, -290],
    [20, 60, 190, -270],
    [60, 20, 210, -270],
    [20, 100, 230, -230],
    [60, 20, 210, -190],
    [20, 120, 190, -160],
    [90, 20, 155, -110],
    [20, 60, 120, -130],
    [50, 80, 135, -180],
    [20, 40, 80, -160],
    [50, 20, 65, -150],
    [10, 80, 45, -180],
    [50, 20, 65, -210],
    [90, 20, 45, -250],
    [90, 20, 155, -250],
  ]
  function makeBoxFloorPosition(
    scaleX,
    scaleZ,
    positionX,
    positionY,
    defaultScaleY,
    defaultPositionY,
    color
  ) {
    const geometry = new THREE.BoxGeometry(scaleX, defaultScaleY, scaleZ)
    const material = new THREE.MeshStandardMaterial({ color: color })
    const mesh = new THREE.Mesh(geometry, material)
    console.log(mesh.position.y)
    mesh.position.x = positionX
    mesh.position.y = defaultPositionY + defaultScaleY / 2
    mesh.position.z = positionY
    scene.add(mesh)
  }
  floor1st.forEach((wall) => {
    makeBoxFloorPosition(...wall, 50, 10, 0x9cd8bf)
  })
  makeBoxFloorPosition(240, 240, 120, -220, 10, 0, 0x000000)

  const movingBallPosStart = [
    [0, 0, 0],
    [20, 0, 0],
    [40, 0, 0],
    [60, 0, 0],
    [80, 0, 0],
    [100, 0, 0],
    [100, 0, -20],
    [100, 0, -40],
    [100, 0, -60],
    [100, 5, -80],
  ]
  const movingBallPosFloor1st = [
    [100, 10, -130],
    [100, 10, -150],
    [100, 10, -170],
    [100, 10, -190],
    [100, 10, -210],
    [100, 10, -230],
    [100, 10, -270],
    [100, 10, -310],
    [80, 10, -130],
    [60, 10, -130],
    [40, 10, -130],
    [30, 10, -130],
    [30, 10, -150],
    [30, 10, -170],
    [30, 10, -190],
    [30, 10, -210],
    [30, 10, -230],
    [40, 10, -230],
    [60, 10, -230],
    [80, 10, -230],
    [120, 10, -230],
    [140, 10, -230],
    [160, 10, -230],
    [170, 10, -230],
    [210, 10, -210],
    [210, 10, -230],
    [210, 10, -250],
    [170, 10, -210],
    [170, 10, -190],
    [170, 10, -170],
    [170, 10, -150],
    [170, 10, -130],
    [40, 10, -270],
    [60, 10, -270],
    [80, 10, -270],
    [120, 10, -270],
    [140, 10, -270],
    [160, 10, -270],
    [60, 10, -190],
    [60, 10, -170],
  ]
  movingBallPosStart.forEach((position) => {
    movingBall(...position, scene, camera)
  })
  movingBallPosFloor1st.forEach((position) => {
    movingBall(...position, scene, camera)
  })

  function putNyoroNyoroCoin(px, py, pz, texture) {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      map: texture,
      alphaTest: 0.5,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(px, py, pz)
    mesh.addEventListener('click', () => {}, { once: true })
    scene.add(mesh)
  }
  putNyoroNyoroCoin(0, 0, 0, texture01_nyoro)

  // ---- ここまで↑ ---- //

  // const tree = makeTree()
  // scene.add(tree)
}
main()
