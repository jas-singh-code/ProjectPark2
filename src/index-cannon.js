import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

const container = document.querySelector('#scene-canvas');

let keyboard = {}
let player = { height: 1.8, speed: 0.15 };
let meshFloor;
let angle = 0.02;
let box;


//defining 3 parameters

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 500 );
  const renderer = new THREE.WebGLRenderer({canvas: container, alpha: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 0 ); // the default
  renderer.shadowMap.enabled = true;
  document.body.append( renderer.domElement );
  

  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -10, 0), // m/s²
  })
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.defaultContactMaterial.friction = 0;

  const groundMaterial = new CANNON.Material("groundMaterial");
  const wheelMaterial = new CANNON.Material("wheelMaterial");
  const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    friction: 0.7,
    restitution: 0.2,
    contactEquationStiffness: 1000
  });

  // We must add the contact materials to the world
  world.addContactMaterial(wheelGroundContactMaterial);



  ///////////////////////////CAR/////////////////////////////////
  camera.position.set(0, 5, 0)
  const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
  const chassisBody = new CANNON.Body({ mass: 150, material: groundMaterial });
  chassisBody.addShape(chassisShape); 
  chassisBody.position.set(0, 4, 0);


  const followCam = THREE.Object3D();
  
//   followCam.position.copy(camera.position);
  scene.add(followCam);
//   followCam.parent = chassisBody.threemesh;

    const options = {
        radius: 0.5,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 30,
        suspensionRestLength: 0.3,
        frictionSlip: 5,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence:  0.01,
        axleLocal: new CANNON.Vec3(-1, 0, 0),
        chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
        maxSuspensionTravel: 0.3,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true
    };

    const vehicle = new CANNON.RaycastVehicle({
        chassisBody: chassisBody,
        indexRightAxis: 0,
        indexUpAxis: 1,
        indeForwardAxis: 2
    });

///////////////////////////CAR/////////////////////////////////

///////////////////////////////////

const radius = 3 // m
const geometry6 = new THREE.SphereGeometry(radius)
const material6 = new THREE.MeshToonMaterial({color: '#191970', emissiveIntensity: 0.6, lightMapIntensity: 0.6})
const sphereMesh = new THREE.Mesh(geometry6, material6)
scene.add(sphereMesh)

const sphereBody = new CANNON.Body({
  mass: 15, // kg
  shape: new CANNON.Sphere(radius),
})
sphereBody.position.set(0, 50, 0) // m
world.addBody(sphereBody);
console.log('world', world, 'sphere', sphereBody);



const groundBody = new CANNON.Body({
  mass: 0, // can also be achieved by setting the mass to 0
  shape: new CANNON.Plane(),
  material: new CANNON.Material()
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
groundBody.position.set(0, -1, 0)
world.addBody(groundBody)



const size = 2;
const halfExtents = new CANNON.Vec3(size, size, size);
const boxShape = new CANNON.Box(halfExtents);
const boxBody = new CANNON.Body({mass: 10, shape: boxShape});
boxBody.position.set(10, 10, 10);
world.addBody(boxBody);

////////////////////////////////////////

// Add lights
let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
// Add hemisphere light to scene
scene.add(hemiLight);

let d = 8.25;
let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 1500;
dirLight.shadow.camera.left = d * -1;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = d * -1;

scene.add(dirLight);

meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100, 100, 100),
	new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
)

meshFloor.rotation.x -= Math.PI /2;
meshFloor.position.y -= 1
scene.add(meshFloor);

const timeStep = 1 / 60; // seconds
let lastCallTime;
//////////////////////////////////////////////////////
function animate() {
  requestAnimationFrame( animate );


  const time = performance.now() / 1000 // seconds
  if (!lastCallTime) {
    world.step(timeStep)
  } else {
    const dt = time - lastCallTime
    world.step(timeStep, dt)
  }
  lastCallTime = time;

  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)

  renderer.render( scene, camera );
}
animate()