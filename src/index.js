import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import cannonDebugger from 'cannon-es-debugger';


let keyboard = {
  ArrowUp: false,
  ArrowDown: false,
}
let player = { height: 1.8, speed: 0.15 };
let meshFloor;
let angle = 0.02;
let box;

const container = document.querySelector('#scene-canvas');


//defining 3 parameters

  const scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 500 );
  const renderer = new THREE.WebGLRenderer({canvas: container, alpha: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 0 ); // the default
  renderer.shadowMap.enabled = true;
  document.body.append( renderer.domElement );
  

  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -55, 0), // m/s²
  })
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.defaultContactMaterial.friction = 0;

  cannonDebugger(scene, world.bodies)

  const groundMaterial = new CANNON.Material("groundMaterial");
  const wheelMaterial = new CANNON.Material("wheelMaterial");
  const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    friction: 0.3,
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
  groundBody.position.set(0, 0, 0)
  world.addBody(groundBody)

  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200, 100, 100),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
  )
  meshFloor.rotation.x -= Math.PI /2;
  meshFloor.position.y =0
  scene.add(meshFloor);

  
  // const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
  // const chassisBody = new CANNON.Body({ mass: 150, material: groundMaterial });
  // chassisBody.addShape(chassisShape);
  // chassisBody.position.set(0, 4, 0);

  // THREE.JS WALLS /////////////////////////////////

  const meshWall1 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true}) 
  )
  // meshWall.rotation.x -= Math.PI /2;
  meshWall1.position.x = 0
  meshWall1.position.z = 50
  scene.add(meshWall1);

  
  const meshWall2 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xf55742, wireframe: true}) 
  );
  meshWall2.position.z = -50;
  scene.add(meshWall2);

  const meshWall3 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x0000FF, wireframe: true}) 
  )
  meshWall3.rotation.y -= Math.PI / 2;
  meshWall3.position.x = 50;
  scene.add(meshWall3);
  
  const meshWall4 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true}) 
    )
  meshWall4.rotation.y -= Math.PI / 2;
  meshWall4.position.x = -50;
  scene.add(meshWall4);

  // CANNON-ES WALLS /////////////////////////////

  const halfExtentsX = new CANNON.Vec3(50, 9 , 5);
  const halfExtentsZ = new CANNON.Vec3(5, 9, 50);

  const wallBound1 = new CANNON.Body({
    shape: new CANNON.Box(halfExtentsX),
    material: groundMaterial,
    mass: 0,
  })
  wallBound1.position.set(0,3, 55);
  // wallBound1.quaternion.setFromEuler(0, 0 , -Math.PI/2)   //WHITE
  world.addBody(wallBound1);
  
  const wallBound2 = new CANNON.Body({
    mass: 0, // can also be achieved by setting the mass to 0
    shape: new CANNON.Box(halfExtentsX),
    material: groundMaterial
  })
  // wallBound2.quaternion.setFromEuler(0, 0, -Math.PI / 2) //RED
  wallBound2.position.set(0, 3, -60)
  world.addBody(wallBound2)
  
  const wallBound3 = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(halfExtentsX),
    material: groundMaterial
  })
  wallBound3.quaternion.setFromEuler(0, -Math.PI / 2 , 0) //BLUE
  wallBound3.position.set(56, 3 , 0);
  world.addBody(wallBound3);
  
  const wallBound4= new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(halfExtentsX),
    material: groundMaterial,
  })
  wallBound4.position.set(-56, 4.5 , 0);
  // wallBound4.quaternion.setFromEuler(0, -Math.PI / 2, 0);  
  wallBound4.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI/2) // YELLOW
  // world.addBody(wallBound4)


  // Make sure to use correct +- sign for plane so that plane is facing up. Affects gravity...
  // wallBound4.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI/2) ^^ SAME THING ^^


  //PROPS/////////////////////////////////////////////
    
  const radius = 5.1 // m
  const geometry6 = new THREE.SphereGeometry(radius)
  const material6 = new THREE.MeshToonMaterial({color: '#191970', emissiveIntensity: 0.6, lightMapIntensity: 0.6})
  const ballMesh = new THREE.Mesh(geometry6, material6)
  scene.add(ballMesh)
  const ballBody = new CANNON.Body({
    mass: 7, // kg
    shape: new CANNON.Sphere(radius),
  })
  ballBody.position.set(0, 20, 0) // m
  world.addBody(ballBody);


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


// const carBody = new CANNON.Body({mass: 2, shape: boxShape, material: wheelMaterial});

const shape = new CANNON.Sphere(3);
const carBody = new CANNON.Body({
  mass: 200,
  shape: shape
})

carBody.position.set(-10, 6, -10);
world.addBody(carBody);

const {carX, carY, carZ} = {carX: 0, carY: .3, carZ: -43 };
let userScore= 0

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
    car.position.set(carX, carY, carZ);
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
camera.position.set(-5, 3, carZ - 5);
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
scene.add( torus );
torus.position.set(0, 1, -20);
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
        userScore += 1;
      }, 1000);
  // } else {
  //       torus.material.color.setHex( 0x000000 )
  }
}

// Event Listeners ///////////////////

  const welcomeMenu = document.getElementById('welcome-menu');
  const cancle = document.getElementById('cancle');
  const skip = document.getElementById('skip-action');
  const begin = document.getElementById('begin-action');
  const welcomeMenu2 = document.getElementById('welcome-menu-2');
  const slide1 = document.getElementById('slide-1');
  const slide2 = document.getElementById('slide-2');

  const viewFullscreen = document.getElementById('view-fullscreen');
  let clicked = 1;
  const message = document.getElementById('message');

  cancle.addEventListener('click', 
  function(){
    welcomeMenu.classList.remove('display');
    welcomeMenu.classList.add('hidden');
    welcomeMenu2.classList.remove('display');
    welcomeMenu2.classList.add('hidden');
  })

  skip.addEventListener('click', 
  function(){
    welcomeMenu.classList.remove('display');
    welcomeMenu.classList.add('hidden');
  })

  begin.addEventListener('click', function(){
    slide1.classList.remove('display');
    slide1.classList.add('hidden');
    slide2.classList.remove('hidden');
    slide2.classList.add('display');
    // welcomeMenu2.classList.remove('hidden');
    // welcomeMenu2.classList.add('display');
  })

  const docEle = document.documentElement;
  viewFullscreen.addEventListener('click', function(){
    if(docEle.requestFullScreen) {
      docEle.requestFullScreen();
      console.log('requestFullScreen worked');
    } else if(docEle.mozRequestFullScreen) {
      docEle.mozRequestFullScreen();
      console.log('mozRequestFullScreen worked');
    } else if(docEle.webkitRequestFullScreen) {
      docEle.webkitRequestFullScreen()
    }else{
      console.log('none worked')
    }
    console.log(document.documentElement.clientHeight)
    // if (clicked === 1){
    //   message.classList.remove('hidden')
    //   message.classList.add('message');
    // }
    clicked -= 1;
  })



//   docEle.addEventListener('fullscreenchange', (event) => {
//   // document.fullscreenElement will point to the element that
//   // is in fullscreen mode if there is one. If there isn't one,
//   // the value of the property is null.
//   if (document.fullscreenElement) {
//     console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
//   } else {
//     console.log('Leaving full-screen mode.');
//   }
// });

/////////////////////////////////////

const timeStep = 1 / 60; // seconds
let lastCallTime;
const score = document.getElementById('score-holder');

score.innerHTML =`Score: ${userScore}`;

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
      player.speed = 1.95
      angle = 0.03;
  } else {
      player.speed = .35
      angle = 0.02;
  }

  torus.rotation.y += 0.01;

  carBody.position.copy(car.position);
  carBody.quaternion.copy(car.quaternion);

  ballMesh.position.copy(ballBody.position);
  ballMesh.quaternion.copy(ballBody.quaternion);
  cube.position.copy(cubeBody.position);
  cube.quaternion.copy(cubeBody.quaternion);
  if(clicked != 1 && clicked > -30){
    camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 500 )
    renderer.setSize( window.innerWidth, window.innerHeight )
    clicked -= 1;
    console.log(document.fullscreenElement)
  }

  if(shrink){
    torus.geometry = new THREE.TorusGeometry( x -= 0.075, y -=0.035 , z += .03 , w );
    torus.rotation.y += 0.08
  };
  camera.lookAt(car.position);

  renderer.render( scene, camera );
}
animate()