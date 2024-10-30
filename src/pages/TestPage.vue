<template>
  <div ref="rendererContainer" class="renderer-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';

const rendererContainer = ref(null);

onMounted(() => {
  // Настройка сцены, камеры и рендерера
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07000c);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  rendererContainer.value.appendChild(renderer.domElement);

  // Добавление света
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 1, 1).normalize();
  scene.add(directionalLight);

  // Создание облака частиц для вортекса
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = [];
  const spiralSpeeds = []; // Вращательная скорость
  const radialSpeeds = []; // Поступательная скорость
  const angles = []; // Текущий угол вращения

  for (let i = 0; i < particleCount; i++) {
    // Рандомизация начального угла и радиуса
    const initialAngle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 5; // Небольшой начальный радиус для разнообразия
    const x = Math.cos(initialAngle) * radius;
    const y = Math.sin(initialAngle) * radius;
    const z = (Math.random() - 0.5) * 30;

    positions.push(x, y, z);
    spiralSpeeds.push((0.02 + Math.random() * 0.02) * 0.5); // Рандомизированная вращательная скорость
    radialSpeeds.push((0.01 + Math.random() * 0.05) * 0.5); // Увеличенная рандомизированная поступательная скорость
    angles.push(initialAngle); // Сохранение текущего угла для каждой частицы
  }

  particles.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  particles.setAttribute(
    'spiralSpeed',
    new THREE.Float32BufferAttribute(spiralSpeeds, 1),
  );
  particles.setAttribute(
    'radialSpeed',
    new THREE.Float32BufferAttribute(radialSpeeds, 1),
  );
  particles.setAttribute('angle', new THREE.Float32BufferAttribute(angles, 1));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.7,
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  function animate() {
    requestAnimationFrame(animate);

    const positions = particleSystem.geometry.attributes.position.array;
    const spiralSpeeds = particleSystem.geometry.attributes.spiralSpeed.array;
    const radialSpeeds = particleSystem.geometry.attributes.radialSpeed.array;
    const angles = particleSystem.geometry.attributes.angle.array;

    for (let i = 0; i < positions.length; i += 3) {
      // Обновление угла и радиуса для эффекта вортекса
      angles[i / 3] += spiralSpeeds[i / 3];
      let radius = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2);
      radius += radialSpeeds[i / 3];

      // Обновление позиций по X и Y
      positions[i] = Math.cos(angles[i / 3]) * radius;
      positions[i + 1] = Math.sin(angles[i / 3]) * radius;

      // Добавление небольшого случайного движения по Z для динамичности
      positions[i + 2] += (Math.random() - 0.5) * 0.1;

      // Удаление частиц, вышедших за пределы камеры, и добавление новых в центре
      if (radius > 40) {
        positions[i] = 0;
        positions[i + 1] = 0;
        positions[i + 2] = (Math.random() - 0.5) * 30;
        angles[i / 3] = Math.random() * Math.PI * 2; // Обновляем начальный угол для новой частицы
        radialSpeeds[i / 3] = 0.1 + Math.random() * 0.2; // Обновляем поступательную скорость для новой частицы
      }
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.angle.needsUpdate = true;

    renderer.render(scene, camera);
  }

  camera.position.z = 40;
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
