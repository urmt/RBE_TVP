// script.js
// This script contains the core logic for the RBE City Simulation.
// It initializes the Core Computer dashboard and a 3D simulation scene.

// Import the three.js and OrbitControls libraries for 3D graphics and camera control
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';

// A simple module to represent the Core Computer
const CoreComputer = {
    // Current state of the system
    status: 'Booting up...',
    systemTime: new Date(),
    
    // A log of messages and events
    eventLog: [],

    // A list of all connected system modules
    modules: {
        'Food Production': { status: 'Offline', icon: '🌱' },
        'Waste Management': { status: 'Offline', icon: '♻️' },
        'Healthcare': { status: 'Offline', icon: '🏥' },
        'Transportation': { status: 'Offline', icon: '🚗' },
        'Labs & Workshops': { status: 'Offline', icon: '🔬' },
        'Education': { status: 'Offline', icon: '📚' }
    },

    // Initialize the Core Computer system
    initialize() {
        console.log('Core Computer: Initializing systems...');
        this.updateStatus('Initializing system modules...');
        this.updateTime();
        this.renderModules();
        this.simulateModuleStatus();
    },

    // Update the system status on the UI
    updateStatus(newStatus) {
        this.status = newStatus;
        document.getElementById('system-status').textContent = newStatus;
        this.logEvent(`Status updated: ${newStatus}`);
    },

    // Update the system time every second
    updateTime() {
        setInterval(() => {
            this.systemTime = new Date();
            const timeString = this.systemTime.toLocaleTimeString();
            document.getElementById('system-time').textContent = timeString;
        }, 1000);
    },

    // Log an event to the console (and eventually, to a history UI)
    logEvent(message) {
        this.eventLog.push({ timestamp: new Date(), message: message });
        console.log(`[${this.systemTime.toLocaleTimeString()}] ${message}`);
    },

    // Render the system modules on the sidebar
    renderModules() {
        const moduleList = document.getElementById('system-modules');
        moduleList.innerHTML = '';
        for (const module in this.modules) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span class="font-bold">${this.modules[module].icon} ${module}:</span> <span id="${module.replace(/\s/g, '-')}-status" class="module-status status-initializing">${this.modules[module].status}</span>`;
            moduleList.appendChild(listItem);
        }
    },
    
    // Simulate the gradual boot-up of each module
    simulateModuleStatus() {
        let delay = 1000;
        for (const module in this.modules) {
            setTimeout(() => {
                this.modules[module].status = 'Online';
                const statusElement = document.getElementById(`${module.replace(/\s/g, '-')}-status`);
                if (statusElement) {
                    statusElement.textContent = 'Online';
                    statusElement.classList.remove('status-initializing');
                    statusElement.classList.add('status-online');
                }
                this.logEvent(`${module} module is now online.`);
            }, delay);
            delay += 1500;
        }
        setTimeout(() => {
            this.updateStatus('All systems operational.');
        }, delay + 500);
    },

    // The main game loop for the simulation
    gameLoop() {
        // This is where the core logic for the simulation will go
        // e.g., update the state of the city, run health checks, etc.
        // For now, it's just a placeholder
    }
};

// --- 3D Simulation using Three.js ---
let scene, camera, renderer, controls, cityGrid;

// Function to set up the 3D scene
function init3D() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Match the body background

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;
    camera.position.y = 15;
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    // Adjust renderer size to fit the container
    const simulationView = document.getElementById('simulation-view');
    renderer.setSize(simulationView.clientWidth, simulationView.clientHeight);
    simulationView.innerHTML = ''; // Clear the "coming soon" text
    simulationView.appendChild(renderer.domElement);
    
    // Add OrbitControls for user interaction
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // smooth camera movement
    controls.dampingFactor = 0.05;

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Create the city grid
    createCityGrid();

    // Add specific system models
    createFoodSystem();

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Start the animation loop
    animate();
}

// Function to create a hexagonal city sector
function createHexagonSector(radius, height, color, position) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 6);
    const material = new THREE.MeshPhongMaterial({ color: color, flatShading: true });
    const hexagon = new THREE.Mesh(geometry, material);
    hexagon.position.set(position.x, position.y, position.z);
    return hexagon;
}

// Function to create the central city hub and surrounding sectors
function createCityGrid() {
    // Sector dimensions and colors
    const sectorRadius = 10;
    const sectorHeight = 2;
    const centralHubColor = 0x64b5f6; // Light blue
    const sectorColor = 0x42a5f5; // Medium blue
    const connectorColor = 0x2196f3; // Darker blue

    // Create the central hub
    const centralHub = createHexagonSector(sectorRadius, sectorHeight * 2, centralHubColor, { x: 0, y: 0, z: 0 });
    scene.add(centralHub);

    // Create the 6 surrounding sectors in a honeycomb pattern
    const angleOffset = Math.PI / 6; // To align hexes properly
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const x = Math.cos(angle) * (sectorRadius * 2);
        const z = Math.sin(angle) * (sectorRadius * 2);
        const sector = createHexagonSector(sectorRadius * 0.9, sectorHeight, sectorColor, { x, y: 0, z });
        sector.userData.id = `sector_${i}`;
        scene.add(sector);

        // Add connecting roads/pathways (simple cylinders for now)
        const connector = new THREE.Mesh(
            new THREE.CylinderGeometry(1.5, 1.5, sectorRadius, 32),
            new THREE.MeshPhongMaterial({ color: connectorColor })
        );
        connector.rotation.z = Math.PI / 2;
        connector.position.set(x * 0.5, 0, z * 0.5);
        scene.add(connector);
    }
}

// Function to create the Food Production system
function createFoodSystem() {
    // Place the food system in the first sector (i=0)
    const sectorRadius = 10;
    const x = Math.cos(0 * Math.PI / 3) * (sectorRadius * 2);
    const z = Math.sin(0 * Math.PI / 3) * (sectorRadius * 2);

    // Create a group to hold the food system objects
    const foodSystemGroup = new THREE.Group();
    foodSystemGroup.position.set(x, 0, z);

    // Create main vertical hydroponic towers
    const towerColor = 0x4caf50; // Green color
    const towerHeight = 15;
    const towerRadius = 1;
    const towerCount = 6;
    const towerDistance = 5;

    for (let i = 0; i < towerCount; i++) {
        const angle = i * Math.PI / (towerCount / 2);
        const towerX = Math.cos(angle) * towerDistance;
        const towerZ = Math.sin(angle) * towerDistance;

        const towerGeometry = new THREE.CylinderGeometry(towerRadius, towerRadius, towerHeight, 32);
        const towerMaterial = new THREE.MeshPhongMaterial({ color: towerColor });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(towerX, towerHeight / 2, towerZ);
        foodSystemGroup.add(tower);

        // Add small growing pods on the tower (simplified)
        const podGeometry = new THREE.BoxGeometry(1.5, 0.5, 1.5);
        const podMaterial = new THREE.MeshPhongMaterial({ color: 0x81c784 }); // Lighter green
        for (let j = 0; j < 5; j++) {
            const pod = new THREE.Mesh(podGeometry, podMaterial);
            pod.position.set(towerX, (j * 2) + 2, towerZ);
            foodSystemGroup.add(pod);
        }
    }

    // Add a central aquaponics reservoir
    const reservoirGeometry = new THREE.CylinderGeometry(4, 4, 1.5, 32);
    const reservoirMaterial = new THREE.MeshPhongMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.7 }); // Water-like color
    const reservoir = new THREE.Mesh(reservoirGeometry, reservoirMaterial);
    reservoir.position.set(0, 0.75, 0);
    foodSystemGroup.add(reservoir);

    // Add the entire group to the scene
    scene.add(foodSystemGroup);
}

// Function to handle window resizing
function onWindowResize() {
    // Update the renderer size based on the new container size
    const simulationView = document.getElementById('simulation-view');
    if (simulationView) {
        camera.aspect = simulationView.clientWidth / simulationView.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(simulationView.clientWidth, simulationView.clientHeight);
    }
}

// The main animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update OrbitControls
    if (controls) {
        controls.update();
    }
    
    renderer.render(scene, camera);
}

// Start the simulation when the page loads
window.onload = function() {
    CoreComputer.initialize();
    init3D();
};
