import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('.canvas');
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);
camera.position.set(0, 2, 5);

// Рендерер
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Управление
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Свет
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Загрузка модели
const loader = new GLTFLoader();
let currentModel = null;

function loadModel(modelName) {
	const modelPath = `models/${modelName}/scene.gltf`;

	if (currentModel) {
		scene.remove(currentModel);
	}

	loader.load(
		modelPath,
		(gltf) => {
			currentModel = gltf.scene;
			currentModel.scale.set(1, 1, 1); // при необходимости увеличь/уменьши
			scene.add(currentModel);
		},
		undefined,
		(error) => {
			console.error(`Ошибка загрузки ${modelName}:`, error);
		},
	);
}

// Загрузка модели по умолчанию
loadModel('Mir_castle');

// Обработка выбора модели
const modelSelector = document.getElementById('modelSelector');
modelSelector.addEventListener('change', (e) => {
	loadModel(e.target.value);
});

// Анимация
function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}
animate();

// Адаптивность
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
