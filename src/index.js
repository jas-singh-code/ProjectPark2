import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -4.82, 0), // m/s²
})

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
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
groundBody.position.set(0, -1, 0)
world.addBody(groundBody)

const size = 2;
const halfExtents = new CANNON.Vec3(size, size, size);
const boxShape = new CANNON.Box(halfExtents);
const boxBody = new CANNON.Body({mass: 4, shape: boxShape});
boxBody.position.set(10, 10, 10);
world.addBody(boxBody);


/////////////////////////////////////////
const loader = new GLTFLoader();
let car = undefined;
let animations = undefined;
loader.load( 'src/car_sel.glb', function ( gltf ) {
  	car = gltf.scene;
	  animations = gltf.animations; 
  	car.scale.set(0.3, 0.3, 0.4);
    car.rotateY( 3 * Math.PI/2);
    console.log(car);
    box = new THREE.Box3().setFromObject( car );
	  scene.add( car );


}, undefined, function ( error ) {

	console.log( error );

}, function (){
	car = gltf.scene;
});

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


/// lines
camera.position.set(0,6, 0);
const material2 = new THREE.LineBasicMaterial({color: 0x0000ff})
const points = [];
points.push( new THREE.Vector3( -10, 0, 4 ) );
points.push( new THREE.Vector3( 0, 10, 4 ) );
points.push( new THREE.Vector3( 10, 0, 4 ) );
const geometry2 = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( geometry2, material2 );
// scene.add( line );
///lines

//ring
const geometry3 = new THREE.TorusGeometry( 5, 2, 16, 100 );
const material3 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const torus = new THREE.Mesh( geometry3, material3 );
torus.position.x = 10;
torus.position.y = 0;
torus.position.z = 10;
scene.add( torus );

meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100, 100, 100),
	new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
)
meshFloor.rotation.x -= Math.PI /2;
meshFloor.position.y -= 1
scene.add(meshFloor);

function keyDown (event){
	keyboard[event.code] = true;
}

function keyUp (event){
	keyboard[event.code] = false;
}
document.body.addEventListener('keydown', keyDown);
document.body.addEventListener('keyup', keyUp);

function updatePositionForCamera(camera) {
  const dx = Math.abs(torus.position.x - car.position.x);
  const dz = Math.abs(torus.position.z - car.position.z);

  if (dz < 2 && dx < 2 ){
      torus.material.color.setHex( 0xffffff );
  } else {
        torus.material.color.setHex( 0x000000 )
  }
}

const timeStep = 1 / 60; // seconds
let lastCallTime;
//////////////////////////////////////////////////////
function animate() {
  requestAnimationFrame( animate );
  updatePositionForCamera(camera);

  const time = performance.now() / 1000 // seconds
  if (!lastCallTime) {
    world.step(timeStep)
  } else {
    const dt = time - lastCallTime
    world.step(timeStep, dt)
  }
  lastCallTime = time;

	if (keyboard["ArrowUp"]){
    boxBody.position.z += Math.sin(car.rotation.y) * player.speed;
    boxBody.position.x += -Math.cos(car.rotation.y) * player.speed;
    
    camera.position.z = boxBody.position.z - 4;
    camera.position.x = boxBody.position.x - 4;
    camera.lookAt(car.position);
	}

    // if (keyboard["KeyW"]){
    //   camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    //   camera.position.z += Math.cos(camera.rotation.y) * player.speed;
    // }

	if (keyboard["ArrowDown"]){
    car.position.z -= Math.sin(car.rotation.y) * player.speed;
		car.position.x -= -Math.cos(car.rotation.y) * player.speed;
    camera.position.z = car.position.z - 4;
    camera.position.x = car.position.x - 4;
    camera.lookAt(car.position);
	}

	if (keyboard["ArrowLeft"]){
		car.rotation.y += Math.PI * angle;
	}

	if (keyboard["ArrowRight"]){
		car.rotation.y -= Math.PI * angle;
	}

    if(keyboard['ShiftLeft'] || keyboard["ShiftRight"])
    {
        angle = 0.03;
        player.speed = 0.5
    } else {
        player.speed = .35
        angle = 0.02;
    }
    torus.rotation.y += 0.01;
    // console.log(`box y position: ${boxBody.position.y}`)
  car.position.copy(boxBody.position);
  car.quaternion.copy(boxBody.quaternion);
  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)
  // render()
  renderer.render( scene, camera );
}
animate()