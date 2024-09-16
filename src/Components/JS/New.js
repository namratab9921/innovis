document.getElementById('box5').addEventListener('click', function () {
  window.location.href = '3D_Viewer/3D_Model.html';
});

// Carousel functionality
let currentIndex = 0;
const images = document.querySelectorAll('.carousel-inner img');
const totalImages = images.length;

function moveCarousel(direction) {
  currentIndex = (currentIndex + direction + totalImages) % totalImages;
  const offset = -currentIndex * 100;
  document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

// Basic setup for 3D scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const modelDiv = document.getElementById('box5');
modelDiv.appendChild(renderer.domElement);

const updateRendererSize = () => {
  const width = modelDiv.clientWidth;
  const height = modelDiv.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
updateRendererSize();
window.addEventListener('resize', updateRendererSize);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const mtlLoader = new THREE.MTLLoader();
mtlLoader.load(
  '3D_small/Model.mtl',
  function (materials) {
    materials.preload();
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(
      '3D_small/Model_center.obj',
      function (object) {
        object.scale.set(0.20, 0.20, 0.20);
        object.rotation.x = 3 * Math.PI / 2;
        scene.add(object);
        object.position.y = 0.3;
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        console.log('An error happened:', error);
      }
    );
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.log('An error happened:', error);
  }
);

camera.position.z = 5;

let rotationSpeed = 0.01;
let rotationAxis = new THREE.Vector3(0, 0, 1);

function animate() {
  requestAnimationFrame(animate);
  scene.traverse(function (child) {
    if (child.isMesh) {
      child.rotateOnAxis(rotationAxis, rotationSpeed);
    }
  });
  renderer.render(scene, camera);
}
animate();