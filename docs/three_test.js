const clock = new THREE.Clock()
const gui = new lil.GUI()
import { Sky } from './lib/threejs/sky.js'
import SysMesModal from './lib/sys-mes-modal.js'
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

function makeTree(position) {
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
  group.position.set(...position)
  return group
}

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader()
    loader.load(url, resolve, undefined, reject)
  })
}
async function main() {
  const contentsPromises = []
  const texture01_nyoro = await loadTexture('img/nyoro.png')

  await Promise.all(contentsPromises)
  // ThreeJSのレンダラーを用意
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 2, 4)
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

  // ---- Skyの調整 ---- //
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

  // ---- ここまで ---- //

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

  const controls = new THREE.OrbitControls(camera, renderer.domElement)

  // DOMにThreeJSのレンダラー(描画結果の出力)を追加
  document.body.appendChild(renderer.domElement)

  function makefloor() {
    const geometry = new THREE.BoxGeometry(2000, 0.1, 2000)
    const material = new THREE.MeshToonMaterial({ color: 0xd2b48c })
    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    return floor
  }
  const floor = makefloor()
  scene.add(floor)

  // const tree = makeTree([0, 0, 2])
  // console.log(tree.children)
  // scene.add(tree)

  // const obj = makeObject(
  //   [0, 0, 0],
  //   0x00ff00,
  //   new THREE.SphereGeometry(1, 32, 32)
  // )
  function movingBall(px, py, pz) {
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshToonMaterial({ color: 0x00ff00 })
    const mesh = new THREE.Mesh(geometry, material)
    material.transparent = true
    material.opacity = 0.5
    mesh.position.set(px, py, pz)
    mesh.addEventListener('click', () => {
      tweenSlide(camera, mesh.position)
    })
    scene.add(mesh)
    return mesh
  }

  function tweenSlide(obj, tgtPositon) {
    const twAnim1 = new TWEEN.Tween(obj.position)
      .to({ x: tgtPositon.x, z: tgtPositon.z }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {})
      .onComplete(() => {})
    const twAnim2 = new TWEEN.Tween(obj.position)
      .to({ y: tgtPositon.y + 2 + 2 }, 500)
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
  }
  floor2nd.forEach((wall) => {
    makeBoxFloorPosition(...wall, 50, 10, 0x9cd8bf)
  })
  makeBoxFloorPosition(240, 240, 120, -220, 10, 0, 0x000000)

  const movingBallPos = [
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
  movingBallPos.forEach((position) => {
    movingBall(...position)
  })

  // ---- ここまで↑ ---- //

  // tweenSlide(tree)

  // gui.add(tree.position, 'x', -2, 2)
  // gui.add(tree.position, 'y', 0, 10)
  // gui.add(tree.position, 'z', -2, 0)
  function putNyoroNyoroCoin(px, py, pz, texture) {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.MeshStandardMaterial({
      // color: 0x000000,
      // transparent: true,
      map: texture01_nyoro,
      side: THREE.DoubleSide,
      alphaTest: 1,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(px, py, pz)
    const coords = { y: 0 }
    const twAnim = new TWEEN.Tween(coords)
      .to({ y: 2 * Math.PI }, 2000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Back.InOut)
      .onUpdate(() => {
        // console.log(mesh.position.y)
        mesh.rotation.y = coords.y
      })
      .onComplete(() => {})
      .start()
    mesh.addEventListener(
      'click',
      () => {
        twAnim.stop()
      },
      { once: true }
    )
    scene.add(mesh)
  }
  putNyoroNyoroCoin(0, 0, 0, texture01_nyoro)
  // ---- 施策 ---- //
  // ---- ここまで↑ ---- //

  // ---- 殿堂入り処理 ---- //
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
      // const smm2 = new SysMesModal()
      const smm = new SysMesModal()
      smm.set_message(['ゲームクリアです！おめでとうございます！'])
      smm.setButtonFunc(() => {
        smm.set_message(['このメッセージを読まれる時が来るとは…'])
        smm.setButtonFunc(() => {
          smm.set_message([
            'この世界は実はまだ未完成で、今後改善されていく可能性があります。',
          ])
          smm.setButtonFunc(() => {
            smm.set_message([
              '今回は最も簡易的な実装となっており、クリア後の要素などがまだありません',
            ])
            smm.setButtonFunc(() => {
              smm.set_message([
                'なので、今回はGoogleFormに殿堂入りとして名前を刻んでいただき、祝福と変えさせていただきたいと思います。',
              ])
              smm.setButtonFunc(() => {
                smm.set_message(['ThankYouForYorPlaying!!'])
                smm.setButtonFunc(() => {
                  smm.set_message([
                    'ボタンを押したらGoogleFormが別タブで開きます',
                  ])
                  smm.setButtonFunc(() => {
                    smm.close()
                    smm.open()
                    window.open('https://forms.gle/nt81VP6bcmEoTS5c9', '_blank')
                  })
                })
              })
            })
          })
        })
        smm.open()
      })
    })
  }
  makeDendoObject(0, 0.5, 0)
  // ---- ここまで↑ ---- //

  makeBoxFloorPosition(20, 20, 100, -110, 20, 10, 0xffffff)
  // 再生開始 (カメラ映像を投影)
  function loop() {
    requestAnimationFrame(loop)
    TWEEN.update()
    renderer.render(scene, camera)
  }
  loop()
}
main()
