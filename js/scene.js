import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js';

document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5dc);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const canvasWidth = window.innerWidth * 0.8;
    const canvasHeight = window.innerHeight * 0.8;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.shadowMap.enabled = true;

    const infoDiv = document.getElementById('infoDiv');
    if (infoDiv) {
        infoDiv.appendChild(renderer.domElement);
    } else {
        console.error('infoDiv not found!');
        return;
    }

    const textureLoader = new THREE.TextureLoader();
    const topTexture = textureLoader.load('./images/minecraft_dirt-top.jpg', (texture) => {
        texture.minFilter = THREE.LinearFilter;
    });
    const sideTexture = textureLoader.load('./images/minecraft_dirt-side.jpg', (texture) => {
        texture.minFilter = THREE.LinearFilter;
    });

    const topMaterial = new THREE.MeshStandardMaterial({ map: topTexture, side: THREE.DoubleSide });
    const sideMaterial = new THREE.MeshStandardMaterial({ map: sideTexture, side: THREE.DoubleSide, smoothShading: true });

    const geometry = new THREE.BoxGeometry(3, 5, 3, 32, 32, 32);
    const materials = [
        sideMaterial,
        sideMaterial,
        topMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial
    ];

    const dirtBlock = new THREE.Mesh(geometry, materials);
    dirtBlock.castShadow = true;
    dirtBlock.receiveShadow = true;
    dirtBlock.position.set(0, -2.5, 0);
    scene.add(dirtBlock);

    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.6 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -5;
    plane.receiveShadow = true;
    scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(0, 10, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.005;

    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 50;

    scene.add(sunLight);

    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1,
        roughness: 0.5,
        metalness: 0.5
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 11, 0);
    scene.add(sun);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    document.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;
            dirtBlock.rotation.y += deltaX * 0.005;
            dirtBlock.rotation.x += deltaY * 0.005;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    let sunAngle = 0;
    function animate() {
        requestAnimationFrame(animate);

        dirtBlock.rotation.x += 0.01;
        dirtBlock.rotation.y += 0.01;

        sunAngle += 0.001;
        sun.position.x = 50 * Math.cos(sunAngle);
        sun.position.z = 50 * Math.sin(sunAngle);
        sun.position.y = 20 * Math.sin(sunAngle);

        sunLight.position.copy(sun.position);

        const dayNightCycle = Math.sin(sunAngle);
        sunLight.intensity = Math.max(0.2, dayNightCycle * 1.5);
        sunLight.color.setHSL((sunAngle / (Math.PI * 2)) % 1, 1, 0.5);

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        const canvasWidth = window.innerWidth * 0.8;
        const canvasHeight = window.innerHeight * 0.8;
        renderer.setSize(canvasWidth, canvasHeight);
    });

    animate();
});
