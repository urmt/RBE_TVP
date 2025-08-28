// script.js
// This script contains the core logic for the RBE City Simulation.
// It initializes the Core Computer dashboard and a 3D simulation scene.

// Import the three.js library for 3D graphics
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

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
let scene, camera, renderer, cityGrid, rotatingObject;

// Function to set up the 3D scene
function init3D() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Match the body background

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth * 0.65, window.innerHeight * 0.95);
    const simulationView = document.getElementById('simulation-view');
    simulationView.innerHTML = ''; // Clear the "coming soon" text
    simulationView.appendChild(renderer.domElement);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Create a rotating object
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshNormalMaterial();
    rotatingObject = new THREE.Mesh(geometry, material);
    scene.add(rotatingObject);

    // Create a grid to represent the city's ground plane
    const gridHelper = new THREE.GridHelper(50, 50, 0x4a5568, 0x4a5568);
    scene.add(gridHelper);

    // Add some light
    const ambientLight = new THREE.AmbientLight(0x404040, 5); // soft white light
    scene.add(ambientLight);

    // Start the animation loop
    animate();
}

// Function to handle window resizing
function onWindowResize() {
    // Update the renderer size based on the new container size
    const simulationView = document.getElementById('simulation-view');
    camera.aspect = simulationView.clientWidth / simulationView.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(simulationView.clientWidth, simulationView.clientHeight);
}

// The main animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the object
    if (rotatingObject) {
        rotatingObject.rotation.x += 0.005;
        rotatingObject.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}

// Start the simulation when the page loads
window.onload = function() {
    CoreComputer.initialize();
    init3D();
};
