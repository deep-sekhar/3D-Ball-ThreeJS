import * as THREE from 'three'; 
import '/style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// for animation 
import gsap from 'gsap'

// Set up the scene
const scene = new THREE.Scene();  

// radius, segments
const geometry = new THREE.SphereGeometry (3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: .2,
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 3, 0);
mesh.castShadow = true;
material.receiveShadow = true;
scene.add(mesh)

// Sizes
const sizes = {
  width: window.innerWidth, 
  height: window.innerHeight,
}

// point Light
const light = new THREE.PointLight(0xffffff, 1, 200)
light.position.set(0, 10, 10);
light.castShadow=true;
scene.add( light );


// When a light source is set up to cast shadows, it creates a virtual camera that "looks" from the perspective of the light towards the scene. This camera is called the "shadow camera". It captures the depth and position of each object that is visible to the light source and calculates how the shadows should be cast based on this information.

// The depth of shadow camera, also known as the "shadow camera's far plane distance", refers to the distance from the light source at which the camera stops rendering objects. Objects that are beyond this distance are not considered by the shadow camera and therefore do not cast shadows. The depth of shadow camera is set using the far property of the shadow camera.
light.shadow.camera.near = 1;
light.shadow.camera.far = 15;

// In Three.js, light.shadow.camera.top is a property that represents the top position of the shadow camera for a light source that casts shadows. The shadow camera is a virtual camera used to render the shadow map for a light source.
light.shadow.camera.right = 1;
light.shadow.camera.left = - 1;
light.shadow.camera.top	= 1;
light.shadow.camera.bottom = -0;

// A Vector2 defining the width and height of the shadow map.
// Higher values give better quality shadows at the cost of computation time
// Values must be powers of 2, up to the WebGLRenderer.capabilities.maxTextureSize for a given device, although the width and height don't have to be the same (so, for example, (512, 1024) is valid). The default is ( 512, 512 ).
light.shadow.mapSize.width = 256;
light.shadow.mapSize.height = 256;

// spot light 
const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 10, 10, 0 );
spotLight.castShadow=true;
scene.add( spotLight );

// ambient light 
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
scene.add( ambientLight );

// floor 
const planeGeometry = new THREE.PlaneGeometry(1000,1000,1,1);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xe9425f });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.set(-1.5708, 0, 0);
plane.position.y = 0;
plane.receiveShadow = true;
scene.add(plane);

// Camera
// FOV, aspect ratio, near clipping point, far clipping point
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.y = 5
camera.position.z = 20
scene.add(camera)

// Renderer
const canvas = document.querySelector('.webgl'); 
const renderer = new THREE.WebGLRenderer({canvas});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.render(scene, camera)

// Controls -> To move around
const controls = new OrbitControls(camera, canvas);
controls.target.set( 0, 5, 0 );
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = true
controls.autoRotate = true
controls.autoRotateSpeed = 6
controls.maxPolarAngle = Math.PI / 2

// Resize on window size change
window.addEventListener('resize', () => {
  // Update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  // Update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

// Re-Render the Canvas
const loop = () => {
  // since we are changing the camera position 
  // rerender the things and update camera controls 
  controls.update()
  renderer.render(scene, camera) 
  window.requestAnimationFrame(loop)
}
loop()

const tt = document.getElementById("haha");
// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 }})
// animate the nav
tl.fromTo('nav', { x: "-100%" }, { x: "0%" }).fromTo(tt, { opacity: 0 }, { opacity: 1 });

// Mouse animation colour
let mouseDown = false
let rgb = []; 
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  if(mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      210,
    ]
  // Animate
  let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
  gsap.to(mesh.material.color, 
    { r: newColor.r, 
      g: newColor.g, 
      b: newColor.b,
    }) 
  }
})
