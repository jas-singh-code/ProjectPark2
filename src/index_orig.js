import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const container = document.querySelector('#scene-canvas');

let keyboard = {}
let player = { height: 1.8, speed: 0.5 };
let meshFloor;

//defining 3 parameters
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 500 );
let helper = new THREE.CameraHelper(camera);
scene.add(helper);
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
	console.log(animations);
	car.scale.set(0.2, 0.2, 0.2);
	scene.add( car );

}, undefined, function ( error ) {

	console.error( error );

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
// Add directional Light to scene
scene.add(dirLight);


/// lines
camera.position.set(1,player.height, 10);
camera.lookAt(new THREE.Vector3(20, player.height, 0));

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
// scene.add( torus );
///ring

meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100, 100, 100),
	new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
)
meshFloor.rotation.x -= Math.PI /2;
meshFloor.position.y -= .9
scene.add(meshFloor);

function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
   object.rotateX(THREE.Math.degToRad(degreeX));
   object.rotateY(THREE.Math.degToRad(degreeY));
   object.rotateZ(THREE.Math.degToRad(degreeZ));
}


function keyDown (event){
	console.log(car);
	keyboard[event.code] = true;
}

function keyUp (event){
	keyboard[event.code] = false;
}
document.body.addEventListener('keydown', keyDown);
document.body.addEventListener('keyup', keyUp);

function updatePositionForCamera(camera) {
    // fixed distance from camera to the object
    const dist = 5;
    const cwd = new THREE.Vector3();
    
    camera.getWorldDirection(cwd);
    
    cwd.multiplyScalar(dist);
    cwd.add(camera.position);
    
	if(car){
		car.position.set(cwd.x , cwd.y -1, cwd.z);
    	car.setRotationFromQuaternion(camera.quaternion);
	}
   
}


// animaition loop 60frames/sec
function animate() {
	requestAnimationFrame( animate );
	if (keyboard["ArrowUp"]){
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}

	if (keyboard["ArrowDown"]){
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}

	if (keyboard["ArrowLeft"]){
		camera.rotation.y += Math.PI * 0.01;
	}
	if (keyboard["ArrowRight"]){
		camera.rotation.y -= Math.PI * 0.01;
	}
	updatePositionForCamera(camera);
    // car.rotation.y += 0.01;
    // torus.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate()