import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

const container = document.querySelector('#scene-canvas');

let keyboard = {
  ArrowUp: false,
  ArrowDown: false,
}
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
    gravity: new CANNON.Vec3(0, -19, 0), // m/s²
  })
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.defaultContactMaterial.friction = 0;

  const groundMaterial = new CANNON.Material("groundMaterial");
  const wheelMaterial = new CANNON.Material("wheelMaterial");
  const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    friction: 0.9,
    restitution: 0.9,
    contactEquationStiffness: 100000
  });

  // We must add the contact materials to the world
  world.addContactMaterial(wheelGroundContactMaterial);
  world.defaultContactMaterial = wheelGroundContactMaterial;



  const groundBody = new CANNON.Body({
    mass: 0, // can also be achieved by setting the mass to 0
    shape: new CANNON.Plane(),
    material: groundMaterial
  })
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
  groundBody.position.set(0, -1, 0)
  world.addBody(groundBody)

  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 100, 100),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
  )
  meshFloor.rotation.x -= Math.PI /2;
  meshFloor.position.y -= 1
  scene.add(meshFloor);

  
  // const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
  // const chassisBody = new CANNON.Body({ mass: 150, material: groundMaterial });
  // chassisBody.addShape(chassisShape);
  // chassisBody.position.set(0, 4, 0);
  ////////////////////// WALLS /////////////////////////////////

  const meshWall1 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
  )
  // meshWall.rotation.x -= Math.PI /2;
  meshWall1.position.x = 0
  meshWall1.position.z = 50
  // scene.add(meshWall1); 

  const meshWall2 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xf55742, wireframe: true})
  );
  meshWall2.position.z = -50;
  scene.add(meshWall2);

  const wallBound2 = new CANNON.Body({
    mass: 0, // can also be achieved by setting the mass to 0
    shape: new CANNON.Plane(),
    material: groundMaterial
  })
  // wallBound2.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
  wallBound2.position.set(0, 0, -50)
  world.addBody(wallBound2)



  const meshWall3 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
  )
  meshWall3.rotation.y -= Math.PI / 2;
  meshWall3.position.x = 50;
  scene.add(meshWall3);

  const meshWall4 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
  )
  meshWall4.rotation.y -= Math.PI / 2;
  meshWall4.position.x = -50;
  scene.add(meshWall4);

  ///////////////////////////END//////////////////////////////////


///////////////////////////////////
///////////////PROPS/////////////////////////////////////////////
const radius = 3 // m
const geometry6 = new THREE.SphereGeometry(radius)
const material6 = new THREE.MeshToonMaterial({color: '#191970', emissiveIntensity: 0.6, lightMapIntensity: 0.6})
const sphereMesh = new THREE.Mesh(geometry6, material6)
scene.add(sphereMesh)
const sphereBody = new CANNON.Body({
  mass: 40, // kg
  shape: new CANNON.Sphere(radius),
})
sphereBody.position.set(5, 10, 5) // m
world.addBody(sphereBody);


const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cube = new THREE.Mesh(cubeGeometry, material3);
// cube.position.set( 100, 100, 3);
scene.add(cube);
const size = 2;
const halfExtents = new CANNON.Vec3(size, size, size);
const boxShape = new CANNON.Box(halfExtents);
const cubeBody = new CANNON.Body({mass: 100, shape: boxShape, material: wheelMaterial});
cubeBody.position.set(50, 5, 50);
world.addBody(cubeBody);
///////////////////////////////////////////////////////////////


// const boxBody = new CANNON.Body({mass: 2, shape: boxShape, material: wheelMaterial});

const shape = new CANNON.Sphere(2);
const boxBody = new CANNON.Body({
  mass: 40,
  shape: shape
})
// carBody.position.set(10,10,10);
// world.addBody(carBody);

boxBody.position.set(-10, 6, -10);
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
    car.rotateY( Math.PI);
    box = new THREE.Box3().setFromObject( car );
    car.position.set(0, 0.3, -40);
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
// camera.position.set(-20 ,6, 0);
camera.position.set(-5, 3, -45);
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
let {x, y, z, w} = {x: 5, y:2, z: 3, w: 10}
const geometry3 = new THREE.TorusGeometry( x, y, z, w );
const material3 = new THREE.MeshToonMaterial( { color: 0xffff00 } );
const torus = new THREE.Mesh( geometry3, material3 );
torus.position.x = 10;
torus.position.y = 0;
torus.position.z = 10;
scene.add( torus );
console.log(torus);
let shrink = false;

////////////////////

const div = document.createElement('DIV');
const text = document.createTextNode('Score');
div.appendChild(text);
document.getElementById('scene-canvas').appendChild(div);

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
      // torus.geometry = new THREE.TorusGeometry( 3, 1, 3, 10 ) works great
      shrink = true;
      setTimeout(function (){ 
        const selected = scene.getObjectById(torus.id);
        scene.remove(selected);
      }, 1000);
  // } else {
  //       torus.material.color.setHex( 0x000000 )
  }
}

const falsy = (ele) => !!ele;

function removeObject(object){
  const selected = scene.getObjectById(object.id);
  scene.remove(selected);
}

function controlling(){
  Object.values(keyboard).some(falsy) ? true :false;
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
    car.position.z += Math.sin(car.rotation.y) * player.speed;
    car.position.x += -Math.cos(car.rotation.y) * player.speed;
    
    camera.position.z = car.position.z - 4;
    camera.position.x = car.position.x - 4;
    camera.lookAt(car.position);
	}
  if (keyboard['KeyW']){
    camera.position.y = 15;
    camera.lookAt(car);
  }else{
    camera.position.y = 3;
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
      angle = 0.03;
      player.speed = 0.5
  } else {
      player.speed = .35
      angle = 0.02;
  }

  torus.rotation.y += 0.01;
   console.log(keyboard);

    boxBody.position.copy(car.position);
    boxBody.quaternion.copy(car.quaternion);

  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);
  cube.position.copy(cubeBody.position);
  cube.quaternion.copy(cubeBody.quaternion);
  
  if(shrink){
    torus.geometry = new THREE.TorusGeometry( x -= 0.075, y -=0.035 , z += .03 , w );
    torus.rotation.y += 0.08
  };
  camera.lookAt(car.position);

  renderer.render( scene, camera );
}
animate()