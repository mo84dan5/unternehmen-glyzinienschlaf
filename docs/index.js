console.log('index.js: loaded')

import Modal from './lib/modal.js'
import SubmitModal from './lib/submit-modal.js'
import SysMesModal from './lib/sys-mes-modal.js'
import { Sky } from './lib/threejs/sky.js'

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

function tweenSlide(
  obj,
  tgtPositon,
  speed = 1000,
  tgtPositionSecond = undefined
) {
  const twAnim1 = new TWEEN.Tween(obj.position)
    .to({ x: tgtPositon.x, z: tgtPositon.z }, speed)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {})
    .onComplete(() => {
      if (tgtPositionSecond) tweenSlide(obj, tgtPositionSecond, 2000)
    })
  const twAnim2 = new TWEEN.Tween(obj.position)
    .to({ y: tgtPositon.y + 5 + 2 }, speed / 2)
    .easing(TWEEN.Easing.Cubic.In)
    .onComplete(() => {})
  const twAnim3 = new TWEEN.Tween(obj.position)
    .to({ y: tgtPositon.y + 2 }, speed / 2)
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
  material.opacity = 0.4
  mesh.addEventListener('click', () => {
    tweenSlide(camera, mesh.position)
  })
  scene.add(mesh)
  return mesh
}
function movingBallBlue(px, py, pz, scene, camera) {
  const geometry = new THREE.SphereGeometry(3, 32, 32)
  const material = new THREE.MeshToonMaterial({ color: 0x0000ff })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(px, py, pz)
  material.transparent = true
  material.opacity = 0.4
  mesh.addEventListener('click', () => {
    tweenSlide(camera, mesh.position)
  })
  scene.add(mesh)
  return mesh
}

function movingBallRed(px, py, pz, tpx, tpy, tpz, scene, camera) {
  const geometry = new THREE.SphereGeometry(3, 32, 32)
  const material = new THREE.MeshToonMaterial({ color: 0xff0000 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(px, py, pz)
  material.transparent = true
  material.opacity = 0.4
  mesh.addEventListener('click', () => {
    tweenSlide(camera, mesh.position, 1000, { x: tpx, y: tpy, z: tpz })
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

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader()
    loader.load(url, resolve, undefined, reject)
  })
}

async function main() {
  await requestPermission()

  const smm = new SysMesModal()
  // const smm2 = new SysMesModal()
  smm.set_message(['???????????????????????????????????????????????????????????????'])
  smm.setButtonFunc(() => {
    smm.set_message(['?????????3D?????????????????????????????????'])
    smm.setButtonFunc(() => {
      smm.set_message([
        '??????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
      ])
      smm.setButtonFunc(() => {
        smm.set_message([
          '????????????????????????(?????????)??????????????????????????????????????????????????????',
        ])
        smm.setButtonFunc(() => {
          smm.set_message([
            '???????????????????????????????????????????????????????????????????????????',
          ])
          smm.setButtonFunc(() => {
            smm.set_message([
              '???????????????????????????(????????????????????????)???????????????????????????',
            ])
            smm.setButtonFunc(() => {
              smm.set_message([
                '?????????????????????????????????????????????????????????????????????',
              ])
              smm.setButtonFunc(() => {
                smm.close()
              })
            })
          })
        })
      })
    })
    smm.open()
  })
  smm.open()

  let nyoronyoroCoin = 0
  // const contentsPromises = []
  const texture01_nyoro = await loadTexture('img/nyoro.png')
  // contentsPromises.push(texture01_nyoro)
  // await Promise.all(contentsPromises)

  // ThreeJS???????????????????????????
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

  // ---- Sky????????? ---- //
  const sky = new Sky()
  sky.scale.setScalar(450000)
  scene.add(sky)

  const sun = new THREE.Vector3()

  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure,
  }

  const uniforms = sky.material.uniforms
  uniforms['turbidity'].value = effectController.turbidity
  uniforms['rayleigh'].value = effectController.rayleigh
  uniforms['mieCoefficient'].value = effectController.mieCoefficient
  uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation)
  const theta = THREE.MathUtils.degToRad(effectController.azimuth)

  sun.setFromSphericalCoords(1, phi, theta)

  uniforms['sunPosition'].value.copy(sun)

  renderer.toneMappingExposure = effectController.exposure

  // ---- ???????????? ---- //

  const controls = new THREE.DeviceOrientationControls(camera, true)
  // DeviceOrientationControls????????????????????????alpha????????????????????????
  window.addEventListener(
    'deviceorientation',
    function fixDeviceOrientationAlphaOffet(event) {
      const deg = event.alpha
      const rad = (((deg / 180 + 1) % 2) - 1) * Math.PI // deg2rad (-?? ??? ??)
      controls.alphaOffset = -rad
    },
    { once: true }
  )

  // DOM???ThreeJS??????????????????(?????????????????????)?????????
  document.body.appendChild(renderer.domElement)
  controls.connect()

  // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
  renderer.domElement.addEventListener('click', (event) => {
    const vec = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      (event.clientY / window.innerHeight) * -2 + 1
    )
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(vec, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    const tgtObj = intersects[0].object
    // intersects ???????????????
    const objects = Array.from(
      new Set(intersects.map((intersect) => intersect.object))
    )
    console.log(objects)
    objects.forEach((object) => {
      if (object === tgtObj) object.dispatchEvent({ type: 'click' })
    })
    // objects[0].dispatchEvent({ type: 'click' })
  })

  // ???????????? (????????????????????????)
  function loop() {
    // console.log(camera.quaternion)
    TWEEN.update()
    requestAnimationFrame(loop)
    controls.update()
    renderer.render(scene, camera)
  }
  loop()

  // ??????????????????

  function makefloor() {
    const geometry = new THREE.BoxGeometry(2000, 0.1, 2000)
    const material = new THREE.MeshToonMaterial({ color: 0x00aa00 })
    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    return floor
  }
  const floor = makefloor()
  scene.add(floor)

  // ---- ???????????????????????? ---- //
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
  const floor2nd = [
    [20, 60, -10, -270],
    [40, 60, 20, -310],
    [40, 20, 60, -330],
    [20, 40, 70, -300],
    [100, 20, 130, -290],
    [100, 20, 130, -190],
    [20, 180, 190, -210],
    [120, 20, 120, -250],
    [20, 40, 70, -200],
    [120, 20, 130, -130],
    [160, 20, 120, -110],
    [20, 40, 70, -140],
    [40, 160, 20, -180],
  ]
  const floor3rd = [
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
  const floor4th = [
    [20, 200, 10, -200],
    [20, 80, 30, -300],
    [100, 20, 90, -330],
    [60, 40, 90, -300],
    [20, 100, 150, -290],
    [20, 60, 170, -270],
    [20, 200, 190, -200],
    [160, 20, 100, -110],
    [40, 20, 100, -130],
    [40, 40, 60, -160],
    [20, 40, 50, -200],
    [60, 60, 130, -170],
    [40, 20, 140, -210],
    [40, 20, 100, -230],
    [60, 20, 90, -250],
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
    return mesh
  }
  floor1st.forEach((wall) => {
    makeBoxFloorPosition(...wall, 50, 10, 0x9cd8bf)
  })
  floor2nd.forEach((wall) => {
    makeBoxFloorPosition(...wall, 50, 110, 0xd3d89c)
  })
  floor3rd.forEach((wall) => {
    makeBoxFloorPosition(...wall, 50, 210, 0xd89cb5)
  })
  floor4th.forEach((wall) => {
    makeBoxFloorPosition(...wall, 50, 310, 0xa09bd8)
  })
  makeBoxFloorPosition(240, 240, 120, -220, 10, 0, 0x000000)
  makeBoxFloorPosition(240, 240, 120, -220, 10, 100, 0x000000)
  makeBoxFloorPosition(240, 240, 120, -220, 10, 200, 0x000000)
  makeBoxFloorPosition(80, 40, 100, -90, 10, 200, 0x000000)
  makeBoxFloorPosition(240, 240, 120, -220, 10, 300, 0x000000)

  // ---- ??????????????? ---- //
  // ---- ?????????????????? ---- //
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
    [140, 10, -270],
    [160, 10, -270],
    [60, 10, -190],
    [60, 10, -170],
  ]
  const movingBallPosFloor2nd = [
    [150, 110, -150],
    [130, 110, -150],
    [110, 110, -150],
    [90, 110, -150],
    [170, 110, -170],
    [150, 110, -170],
    [130, 110, -170],
    [110, 110, -170],
    [90, 110, -170],
    [50, 110, -170],
    [50, 110, -190],
    [50, 110, -210],
    [50, 110, -230],
    [50, 110, -250],
    [50, 110, -270],
    [90, 110, -270],
    [110, 110, -270],
    [130, 110, -270],
    [150, 110, -270],
    [90, 110, -230],
    [110, 110, -230],
    [130, 110, -230],
    [150, 110, -230],
    [170, 110, -230],
    [170, 110, -210],
    [150, 110, -210],
    [130, 110, -210],
    [110, 110, -210],
    [90, 110, -210],
    [50, 110, -310],
    [10, 110, -270],
    [50, 110, -130],
  ]
  const movingBallPosFloor3rd = [
    [100, 210, -130],
    [100, 210, -150],
    [100, 210, -170],
    [100, 210, -190],
    [100, 210, -210],
    [100, 210, -230],
    [100, 210, -270],
    [100, 210, -310],
    [80, 210, -130],
    [60, 210, -130],
    [40, 210, -130],
    [30, 210, -130],
    [30, 210, -150],
    [30, 210, -170],
    [30, 210, -190],
    [30, 210, -210],
    [30, 210, -230],
    [40, 210, -230],
    [60, 210, -230],
    [80, 210, -230],
    [120, 210, -230],
    [140, 210, -230],
    [160, 210, -230],
    [170, 210, -230],
    [210, 210, -210],
    [210, 210, -230],
    [210, 210, -250],
    [170, 210, -210],
    [170, 210, -190],
    [170, 210, -170],
    [170, 210, -150],
    [170, 210, -130],
    [40, 210, -270],
    [60, 210, -270],
    [140, 210, -270],
    [160, 210, -270],
    [60, 210, -190],
  ]
  const movingBallPosFloor4th = [
    [50, 310, -290],
    [50, 310, -270],
    [50, 310, -250],
    [50, 310, -250],
    [50, 310, -230],
    [30, 310, -250],
    [30, 310, -230],
    [30, 310, -210],
    [30, 310, -190],
    [30, 310, -170],
    [30, 310, -150],
    [30, 310, -130],
    [70, 310, -210],
    [70, 310, -190],
    [70, 310, -130],
    [90, 310, -190],
    [90, 310, -150],
    [90, 310, -270],
    [110, 310, -270],
    [130, 310, -270],
    [130, 310, -250],
    [130, 310, -230],
    [150, 310, -230],
    [170, 310, -230],
    [170, 310, -190],
    [170, 310, -150],
    [170, 310, -130],
  ]
  movingBallPosStart.forEach((position) => {
    movingBall(...position, scene, camera)
  })
  movingBallPosFloor1st.forEach((position) => {
    movingBall(...position, scene, camera)
  })
  movingBallPosFloor2nd.forEach((position) => {
    movingBall(...position, scene, camera)
  })
  movingBallPosFloor3rd.forEach((position) => {
    movingBall(...position, scene, camera)
  })
  movingBallPosFloor4th.forEach((position) => {
    movingBall(...position, scene, camera)
  })
  // movingBallBlue(...[100, 10, -100], scene, camera)
  movingBallRed(...[130, 10, -130], ...[170, 110, -150], scene, camera)
  movingBallRed(...[170, 110, -150], ...[130, 10, -130], scene, camera)

  movingBallRed(...[170, 110, -270], ...[60, 210, -170], scene, camera)
  movingBallRed(...[60, 210, -170], ...[170, 110, -270], scene, camera)

  movingBallRed(...[100, 210, -90], ...[50, 310, -310], scene, camera)
  movingBallRed(...[50, 310, -310], ...[100, 210, -90], scene, camera)

  // ---- ??????????????? ---- //
  // ---- ???????????????????????????????????? ---- //
  function putNyoroNyoroCoin(px, py, pz) {
    const geometry = new THREE.PlaneGeometry(1.5, 1.5)
    const material = new THREE.MeshStandardMaterial({
      // color: 0x000000,
      // transparent: true,
      map: texture01_nyoro,
      side: THREE.DoubleSide,
      alphaTest: 1,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(px, py + 1.5 / 2 + 0.5, pz)
    const coords = { ry: 0, py: py }
    const twAnim = new TWEEN.Tween(coords)
      .to({ ry: 2 * Math.PI }, 2000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Back.InOut)
      .onUpdate(() => {
        mesh.rotation.y = coords.ry
      })
      .onComplete(() => {})
      .start()
    mesh.addEventListener(
      'click',
      () => {
        const twAnim2 = new TWEEN.Tween(mesh.position)
          .to({ y: coords.py + 10 }, 1000)
          .easing(TWEEN.Easing.Elastic.InOut)
          .start()
          .onComplete(() => {
            nyoronyoroCoin++
            console.log(nyoronyoroCoin)
            material.dispose()
            geometry.dispose()
            scene.remove(mesh)
          })
        const twAnim3 = new TWEEN.Tween(mesh.scale)
          .to({ x: 0, y: 2 }, 1000)
          .easing(TWEEN.Easing.Back.In)
          .start()
      },
      { once: true }
    )
    scene.add(mesh)
  }
  const ncs = [
    [0, 0, -5],

    [25, 10, -180],
    [55, 10, -180],
    [25, 10, -265],
    [100, 10, -315],
    [175, 10, -265],
    [215, 10, -255],
    [205, 10, -205],

    [85, 110, -145],
    [55, 110, -125],
    [175, 110, -205],
    [5, 110, -265],
    [55, 110, -315],
    [130, 110, -265],

    [25, 210, -180],
    [55, 210, -180],
    [25, 210, -265],
    [100, 210, -315],
    [175, 210, -265],
    [205, 210, -205],
    [135, 210, -135],
    [135, 210, -125],

    [65, 310, -185],
    [95, 310, -145],
    [115, 310, -215],
    [75, 310, -125],
    [125, 310, -225],
    [135, 310, -315],
  ]
  ncs.forEach((nc) => putNyoroNyoroCoin(...nc))

  // ---- ??????????????? ---- //
  // ---- ?????????????????? ---- //
  function setQuiz(px, py, pz, nc, id, answer) {
    // const obj = makeBoxFloorPosition(20, 20, px, pz, 10, 10, 0xffffff)
    const geometry = new THREE.BoxGeometry(20, 20, 20)
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = px
    mesh.position.y = py + 20 / 2
    mesh.position.z = pz
    scene.add(mesh)
    mesh.addEventListener('click', () => {
      if (nyoronyoroCoin < nc) {
        console.log('aaaaaa')
        const message = '??????' + (nc - nyoronyoroCoin) + '???'
        const ssm = new SysMesModal()
        ssm.set_message([message, '??????????????????????????????????????????????????????'])
        ssm.setButtonFunc(() => {})
        ssm.open()
      } else {
        const modal = new Modal(id)
        modal.setButtonFunc(
          answer,
          () => {
            const twAnim = new TWEEN.Tween(mesh.scale)
              .to({ x: 0, z: 0 }, 2000)
              .easing(TWEEN.Easing.Elastic.Out)
              .onComplete(() => {
                material.dispose()
                geometry.dispose()
                scene.remove(mesh)
                movingBallBlue(px, py, pz, scene, camera)
              })
              .start()
          },
          () => {
            modal.close()
          }
        )
        modal.open()
      }
    })
  }
  const quiz = [
    [100, 10, -110, 1, 'quiz-1st-floor-01', '0607'],
    [80, 10, -190, 2, 'quiz-1st-floor-02', '??????'],
    [80, 10, -270, 3, 'quiz-1st-floor-03', '????????????????????????'],
    [120, 10, -270, 4, 'quiz-1st-floor-04', '???'],
    [100, 10, -290, 5, 'quiz-1st-floor-05', '??????'],
    [190, 10, -230, 6, 'quiz-1st-floor-06', 'FJK'],
    [150, 10, -130, 8, 'quiz-1st-floor-07', '????????????????????????'],

    [70, 110, -170, 9, 'quiz-2nd-floor-01', '???'],
    [50, 110, -150, 9, 'quiz-2nd-floor-02', '????????????'],
    [70, 110, -230, 10, 'quiz-2nd-floor-03', '???????????????'],
    [30, 110, -270, 11, 'quiz-2nd-floor-04', '???????????????????????????'],
    [50, 110, -290, 12, 'quiz-2nd-floor-05', '????????????'],
    [70, 110, -270, 13, 'quiz-2nd-floor-06', '???????????????????????????'],

    [80, 210, -190, 14, 'quiz-3rd-floor-01', '??????'],
    [120, 210, -270, 15, 'quiz-3rd-floor-02', '????????????????????????'],
    [100, 210, -290, 16, 'quiz-3rd-floor-03', '?????????????????????'],
    [80, 210, -270, 17, 'quiz-3rd-floor-04', '???????????????'],
    [150, 210, -130, 18, 'quiz-3rd-floor-05', '25521571'],
    [190, 210, -230, 20, 'quiz-3rd-floor-06', '???????????????'],
    [100, 210, -110, 21, 'quiz-3rd-floor-07', '???'],

    [70, 310, -230, 21, 'quiz-4th-floor-01', 'LEALILA'],
    [90, 310, -210, 22, 'quiz-4th-floor-02', '?????????'],
    [90, 310, -170, 23, 'quiz-4th-floor-03', '2'],
    [50, 310, -130, 24, 'quiz-4th-floor-04', '???????????????'],
    [70, 310, -270, 25, 'quiz-4th-floor-05', '????????????????????????X'],
    [130, 310, -290, 26, 'quiz-4th-floor-06', '????????????????????????'],
    [170, 310, -210, 27, 'quiz-4th-floor-07', '???????????????'],
    [170, 310, -170, 27, 'quiz-4th-floor-08', '1271'],
    [150, 310, -130, 27, 'quiz-4th-floor-09', '33'],
  ]
  quiz.forEach((q) => setQuiz(...q))
  // ---- ??????????????? ---- //

  // ---- ?????????????????? ---- //
  function makeDendoObject(px, py, pz) {
    const geometry = new THREE.BoxGeometry(5, 5, 5)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.5,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = px
    mesh.position.y = py + 5 / 2
    mesh.position.z = pz
    scene.add(mesh)
    mesh.addEventListener('click', () => {
      window.open('https://forms.gle/nt81VP6bcmEoTS5c9', '_blank')
    })
  }
  makeDendoObject(130, 310.5, -130)
  // ---- ??????????????? ---- //

  // const tree = makeTree()
  // scene.add(tree)
}
main()
