import * as THREE from 'three';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Body, World } from "oimo";
const world = new World({ 
    timestep: 1/60, 
    iterations: 8, 
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: true,   // calculate statistic or not
    gravity: [0,-9.8,0] 
});

var body = world.add({ 
    type:'sphere', // type of shape : sphere, box, cylinder 
    size:[10,10,10], // size of shape
    pos:[-20, 6, -20], // start position in degree
    rot:[0,0,90], // start rotation in degree
    move: true, // dynamic or statique
    density: 5,
    friction: 0.2,
    restitution: 0.2,
    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
});

var carBody = world.add({ 
    type:'box', // type of shape : sphere, box, cylinder 
    size:[2,1,2], // size of shape
    pos:[-20, 0, 20], // start position in degree
    rot:[0,0,0], // start rotation in degree
    move: true, // dynamic or statique
    density: 1,
    friction: 0.2,
    restitution: 0.2,
    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
});

const container = document.querySelector('#scene-canvas');

let keyboard = {}
let player = { height: 1.8, speed: 0.15 };
let meshFloor;
let angle = 0.02;
let box;

//defining 3 parameters
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 500 );
let helper = new THREE.CameraHelper(camera);
// scene.add(helper);
const renderer = new THREE.WebGLRenderer({canvas: container, alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, 0 ); // the default
renderer.shadowMap.enabled = true;
document.body.append( renderer.domElement );

const loader = new GLTFLoader();
let car = undefined;
let animations = undefined;
loader.load( 'src/car_sel.glb', function ( gltf ) {
  	car = gltf.scene;
	  animations = gltf.animations; // AnimationClip {name: "EmptyAction.004", ...
	  car.scale.set(0.2, 0.2, 0.3);
    car.rotateY( 3 * Math.PI/2);
	  scene.add( car );
}, undefined, function ( error ) {
	console.log( error );
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
// Add directional Light to scene
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
torus.position.x = 30;
torus.position.y = 0;
torus.position.z = 30;
scene.add( torus );
///ring
// FLOOR

const ground = world.add({size:[500, 500, 50], pos:[0,-1,0],  rot: [270, 0, 0], density: 1 });
meshFloor = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(100, 100, 100, 100),
	new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
)
meshFloor.position.copy(ground.getPosition());
meshFloor.quaternion.copy(ground.getQuaternion());
scene.add(meshFloor);
// meshFloor.rotation.x -= Math.PI /2;
// meshFloor.position.y = -1;
console.log(meshFloor);
// FLOOR


let geometry4 = new THREE.BoxBufferGeometry(10, 10, 10);
let material4 = new THREE.MeshNormalMaterial();
let cube = new THREE.Mesh(geometry4, material4);
cube.castShadow = true;
cube.receiveShadow = true;
cube.scale.set(1, 1, 1);
cube.position.copy(body.getPosition());
cube.quaternion.copy(body.getQuaternion());
scene.add(cube);
// cube.position.x = -20;
// cube.position.z = -20;
// cube.position.y = 5.1;

console.log(cube);

function keyDown (event){
	keyboard[event.code] = true;
    console.log(event.code);
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

function updateCar(){
	if (keyboard["ArrowUp"]){
    car.position.z += Math.sin(car.rotation.y) * player.speed;
    car.position.x += -Math.cos(car.rotation.y) * player.speed;
    
    camera.position.z = car.position.z - 4;
    camera.position.x = car.position.x - 4;
    camera.lookAt(car.position);
	}
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
      angle = 0.04;
      player.speed = 0.8
  } else {
      player.speed = .35
      angle = 0.02;
  }
}

// animaition loop 60frames/sec
function animate() {
  requestAnimationFrame( animate )
  updateCar()
  torus.rotation.y += 0.01;
  world.step();
	renderer.render( scene, camera );
}
animate()