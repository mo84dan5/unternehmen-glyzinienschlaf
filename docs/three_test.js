const clock = new THREE.Clock()
const gui = new lil.GUI()

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
  group.position.set(position)
  return group
}

function main() {
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
  const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
    antialias: true,
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

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

  const tree = makeTree([0, 0, 2])
  scene.add(tree)

  // const obj = makeObject(
  //   [0, 0, 0],
  //   0x00ff00,
  //   new THREE.SphereGeometry(1, 32, 32)
  // )
  function movingBall(position) {
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshToonMaterial({ color: 0x00ff00 })
    const mesh = new THREE.Mesh(geometry, material)
    material.transparent = true
    material.opacity = 0.5
    mesh.addEventListener('click', () => {
      tweenSlide(camera, mesh.position)
    })
    return mesh
  }
  const ball = movingBall([0, 0, 0])
  scene.add(ball)

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
  // tweenSlide(tree)

  // gui.add(tree.position, 'x', -2, 2)
  // gui.add(tree.position, 'y', 0, 10)
  // gui.add(tree.position, 'z', -2, 0)

  // 再生開始 (カメラ映像を投影)
  function loop() {
    requestAnimationFrame(loop)
    TWEEN.update()
    renderer.render(scene, camera)
  }
  loop()
}
main()
