function main() {
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
  // DOMにThreeJSのレンダラー(描画結果の出力)を追加
  document.body.appendChild(renderer.domElement)

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

  // 再生開始 (カメラ映像を投影)
  function loop() {
    requestAnimationFrame(loop)
    spotLight.position.copy(camera.position)
    spotLight.quaternion.copy(camera.quaternion)
    renderer.render(scene, camera)
    if (cube) cube.rotation.x = cube.rotation.x + 1
  }
  loop()
}
main()
