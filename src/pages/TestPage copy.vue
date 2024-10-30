<template>
  <div ref="rendererContainer" class="renderer-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const rendererContainer = ref(null);

onMounted(() => {
  function choose(choices) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

  // Настройка сцены, камеры и рендерера
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x07000a);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  rendererContainer.value.appendChild(renderer.domElement);

  // Добавление контролов камеры (опционально)
  // const controls = new OrbitControls(camera, renderer.domElement);

  // Добавление света
  const ambientLight = new THREE.AmbientLight(0x7e57c2, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xcdb0fd, 1);
  directionalLight.position.set(0, 1, 1).normalize();
  scene.add(directionalLight);

  // Массив слов для облака
  const baseWords = [
    'ФАНТАСТИКА',
    'ПРОГРЕСС',
    'ПРОДУКТИВНОСТЬ',
    'AI',
    'WOW!',
    'GPT',
    'WowGPT',
    'ТЕХНОЛОГИЯ',
    'ЭВРИКА',
    'ИНТЕЛЛЕКТ',
    'ВДОХНОВЕНИЕ',
    'БУДУЩЕЕ',
    'Открытия',
    'Воображение',
    'Перспективы',
    'Гармония',
    'Знание',
    'Прогресс',
    'Мультизадачность',
    'Технологии',
    'Отдых',
    'Аналитика',
    'Исследование',
    'Искусство',
  ];
  const baseColors = [0xaaaaff, 0xffccff, 0xffffff];

  const words = [];
  for (let i = 0; i < 200; i++) {
    words.push(
      Math.random() > 0.5
        ? choose(baseWords).toUpperCase()
        : choose(baseWords).toLowerCase(),
    );
  }

  // Массив для хранения мешей слов и их параметров
  const wordObjects = [];

  // Загрузка шрифта и создание текстовых мешей
  const loader = new FontLoader();
  loader.load('/Rubik Medium_Regular.json', function (font) {
    words.forEach(function (word) {
      createTextMesh(word, font);
    });
  });

  function updateWordPosition(wordObject, ticks) {
    wordObject.angle += wordObject.speed * ticks;
    wordObject.radius += wordObject.spiralSpeed * ticks;

    camera.updateMatrix();
    camera.updateMatrixWorld();
    const frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      ),
    );

    if (
      !frustum.containsPoint(
        wordObject.mesh.position.clone().multiplyScalar(0.95),
      )
    ) {
      wordObject.radius = 0;
      wordObject.angle = Math.random() * Math.PI * 2;
    }

    const x = wordObject.radius * Math.cos(wordObject.angle);
    const y = wordObject.radius * Math.sin(wordObject.angle);

    wordObject.mesh.position.set(x, y, wordObject.mesh.position.z);
    wordObject.mesh.rotation.z = wordObject.angle * 1.04 + Math.PI / 2;
    const scale = 0.7 + Math.max(wordObject.radius / 30, 0.1);
    wordObject.mesh.scale.set(scale, scale, scale);
    wordObject.mesh.material.opacity = Math.min(scale, 0.95);
    wordObject.mesh.material.transparent = true;
  }

  function createTextMesh(word, font) {
    const textGeometry = new TextGeometry(word, {
      font: font,
      size: 1,
      height: 0.01,
      curveSegments: 4,
      bevelEnabled: false,
    });
    const textMaterial = new THREE.MeshPhongMaterial({
      color: choose(baseColors),
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    const radius = 0;
    const angle = Math.random() * Math.PI * 2;
    // const speed = Math.random() * 0.005 + 0.001;
    const speed = 0.0025 + 0.001;
    const spiralSpeed = Math.random() * 0.1 + 0.075;
    const maxRadius = 75;

    textMesh.position.set(0, 0, Math.random() * 10);

    const wordObject = {
      mesh: textMesh,
      radius: radius,
      angle: angle,
      speed: speed,
      spiralSpeed: spiralSpeed,
      maxRadius: maxRadius,
    };

    updateWordPosition(wordObject, Math.random() * 400);
    scene.add(textMesh);
    wordObjects.push(wordObject);
  }

  camera.position.z = 300;

  const particleCount = 1500;
  const particles = new THREE.BufferGeometry();
  const positions = [];
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions.push(0, 0, 0);
    velocities.push(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
    );
  }

  particles.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  particles.setAttribute(
    'velocity',
    new THREE.Float32BufferAttribute(velocities, 3),
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffca28,
    size: 0.2,
    transparent: true,
    opacity: 0.8,
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  function animate() {
    requestAnimationFrame(animate);

    wordObjects.forEach((x) => updateWordPosition(x, 1));

    camera.position.z =
      performance.now() - startTime < 4000
        ? 350 * (1 - (performance.now() - startTime) / 4000) + 55
        : 55;
    camera.rotation.z += 0.0005;

    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.geometry.attributes.velocity.array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      if (
        positions[i] > 50 ||
        positions[i] < -50 ||
        positions[i + 1] > 50 ||
        positions[i + 1] < -50 ||
        positions[i + 2] > 50 ||
        positions[i + 2] < -50
      ) {
        positions[i] = 0;
        positions[i + 1] = 0;
        positions[i + 2] = 0;
      }
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  const startTime = performance.now();
  animate();

  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});
</script>

<style scoped>
.renderer-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
