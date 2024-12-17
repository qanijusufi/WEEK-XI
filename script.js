import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();

raycaster.near = 0.0;
raycaster.far = 100;

const mouse = new THREE.Vector2();

const cubes = [];
let lastSelectedCube = null;
let lastSelectedCubeColor = null;

function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomColor() {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
}

for (let i = 0; i < 30; i++) {
  const size = randBetween(0.2, 1);
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({
    color: `#${getRandomColor()}`,
  });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(randBetween(-4, 4), randBetween(-4, 4), randBetween(-5, 0));

  scene.add(mesh);
  cubes.push(mesh);
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubes, true); // true enables recursive intersection check

  if (intersects.length > 0) {
    const selectedCube = intersects[0].object;

    if (lastSelectedCube && lastSelectedCube !== selectedCube) {
      lastSelectedCube.material.color.set(lastSelectedCubeColor);
    }

    lastSelectedCube = selectedCube;
    lastSelectedCubeColor = `#${selectedCube.material.color.getHexString()}`;
    selectedCube.material.color.set(0xffffff);
  }
});

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
