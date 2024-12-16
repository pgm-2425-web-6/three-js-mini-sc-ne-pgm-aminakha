// Import Three.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js';

// Scene setup
const scene = new THREE.Scene();

// Set a cozy beige background color (RGB: 245, 245, 220 or #f5f5dc)
scene.background = new THREE.Color(0xf5f5dc); // Beige color

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 10); // Adjust camera position to properly see the cube

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// Load textures for Dirt Block
const textureLoader = new THREE.TextureLoader();
const topTexture = textureLoader.load('./images/minecraft_dirt-top.jpg', (texture) => {
  texture.minFilter = THREE.LinearFilter; // Smooth the texture
});
const sideTexture = textureLoader.load('./images/minecraft_dirt-side.jpg', (texture) => {
  texture.minFilter = THREE.LinearFilter; // Smooth the texture
});

// Create materials for each side of the cube
const topMaterial = new THREE.MeshStandardMaterial({ map: topTexture, side: THREE.DoubleSide });
const sideMaterial = new THREE.MeshStandardMaterial({ map: sideTexture, side: THREE.DoubleSide });

// Create a 1x1x1 cube for the dirt block
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Apply the materials to the sides of the cube
const materials = [
    sideMaterial, // Left
    sideMaterial, // Right
    topMaterial,  // Top
    sideMaterial, // Bottom
    sideMaterial, // Front
    sideMaterial  // Back
];

const dirtBlock = new THREE.Mesh(geometry, materials);
dirtBlock.castShadow = true;
dirtBlock.receiveShadow = true;

// Add dirt block to the scene
scene.add(dirtBlock);

// Ground plane (set to beige color)
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.6 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -4;
plane.receiveShadow = true; // Allow plane to receive shadows
scene.add(plane);

// Ambient light (to soften shadows)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft ambient light
scene.add(ambientLight);

// Sun-like directional light (simulating sunlight)
const sunLight = new THREE.DirectionalLight(0xffffff, 1); // White light with intensity of 1
sunLight.position.set(10, 10, 10); // Initial position of the sun in the sky
sunLight.castShadow = true; // Enable shadows from the sun
sunLight.shadow.mapSize.width = 1024; // Shadow resolution
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.bias = -0.005; // Fix shadow artifacts

// Sun's shadow settings
sunLight.shadow.camera.left = -20;
sunLight.shadow.camera.right = 20;
sunLight.shadow.camera.top = 20;
sunLight.shadow.camera.bottom = -20;
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 50;

// Add the sun light to the scene
scene.add(sunLight);

// Visual helper for the sun (optional)
const lightHelper = new THREE.DirectionalLightHelper(sunLight, 5); // Helper to visualize the sun's direction
scene.add(lightHelper);

// Create a glowing sun (yellow sphere)
const sunGeometry = new THREE.SphereGeometry(2, 32, 32); // Sphere geometry for the sun
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00, // Yellow color
    emissive: 0xffff00, // Emissive yellow for glow effect
    emissiveIntensity: 1, // Intensity of the glow
    roughness: 0.5, // Surface roughness for a more realistic sun
    metalness: 0.5 // Add some metallic shine
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

// Position the sun in the scene and add it to the scene
sun.position.set(10, 10, 10); // Place the sun at a high position
scene.add(sun);

// Variables for drag functionality
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Mouse events to track dragging
document.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        // Rotate the dirt block based on mouse movement
        dirtBlock.rotation.y += deltaX * 0.005; // Rotate horizontally (left-right)
        dirtBlock.rotation.x += deltaY * 0.005; // Rotate vertically (up-down)

        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Animation loop
let sunAngle = 0; // Angle to animate the sun's position across the sky
function animate() {
    requestAnimationFrame(animate);

    // Rotate the dirt block for better visibility
    dirtBlock.rotation.x += 0.01;
    dirtBlock.rotation.y += 0.01;

    // Simulate the sun moving across the sky (Day to Night cycle)
    sunAngle += 0.001; // Change this value for faster/slower sun movement
    sun.position.x = 50 * Math.cos(sunAngle); // Sun's X position
    sun.position.z = 50 * Math.sin(sunAngle); // Sun's Z position
    sun.position.y = 20 * Math.sin(sunAngle); // Sun's Y position (to simulate rising and setting)

    // Also move the light source to match the sun's position
    sunLight.position.copy(sun.position); // Light follows the sun

    // Update the light helper to follow the sun's position
    lightHelper.update();

    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();
