import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import cannonDebugger from 'cannon-es-debugger';
import { TetrahedronGeometry, Vector3 } from 'three';

// MAKE BOX PRYAMID TO SMASH THROUGH IN BEGINNING

let keyboard = {
  ArrowUp: false,
  ArrowDown: false,
}
let player = { height: 1.8, speed: 0.15 };
let meshFloor;
let angle = 0.02;
let box;
const colors = {
  0: 0xFF0000, 
  1: 0x002EFF,
  2: 0x00B413,
  3: 0xFFF000,
  4: 0xFF00BD,
  5: 0xB200FF
}

const container = document.querySelector('#scene-canvas');


//defining 3 parameters

  const scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 500 );
  const renderer = new THREE.WebGLRenderer({canvas: container, alpha: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 0 ); // the default
  renderer.shadowMap.enabled = true;
  document.body.append( renderer.domElement );
  
  // const world = new CANNON.World({
  //   gravity: new CANNON.Vec3(0, -17, 0), // m/s²
  // })
  // // world.broadphase = new CANNON.SAPBroadphase(world);
  
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20, 0)
  })
  world.solver.tolerance = 0.001;
  world.broadphase = new CANNON.NaiveBroadphase();
  world.defaultContactMaterial.friction = 0.1;
  

  const groundMaterial = new CANNON.Material("groundMaterial");
  const wheelMaterial = new CANNON.Material("wheelMaterial");
  const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    friction: 0.7,
    restitution: 0.2,
    contactEquationStiffness: 5000
  });

  const bodyToBodyContactMaterial = new CANNON.ContactMaterial(wheelMaterial,wheelMaterial, {
    friction: 0.9,
    restitution: 0.9
  })
  world.addContactMaterial(bodyToBodyContactMaterial);

  world.addContactMaterial(wheelGroundContactMaterial);

  // We must add the contact materials to the world
  // world.addContactMaterial(wheelGroundContactMaterial);
  // world.defaultContactMaterial = wheelGroundContactMaterial;

  // cannonDebugger(scene, world.bodies);

  const groundBody = new CANNON.Body({
    mass: 0, // can also be achieved by setting the mass to 0
    shape: new CANNON.Plane(),
    material: groundMaterial
  })
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
  groundBody.position.set(0, 0, 0)
  world.addBody(groundBody)

  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 700, 100, 100),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
  )
  meshFloor.rotation.x -= Math.PI /2;
  meshFloor.position.y = 0;
  meshFloor.position.z = 200;
  scene.add(meshFloor);
  
  // const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
  // const chassisBody = new CANNON.Body({ mass: 150, material: groundMaterial });
  // chassisBody.addShape(chassisShape);
  // chassisBody.position.set(0, 4, 0);

  // THREE.JS WALLS /////////////////////////////////

  const meshWall1 = new THREE.Mesh(
    new THREE.BoxGeometry(175, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x303030, wireframe: false}) //goal FRONT WALL
  )
  // meshWall.rotation.x -= Math.PI /2;
  meshWall1.position.x = 0
  meshWall1.position.z = 200
  scene.add(meshWall1);

  
  const meshWall2 = new THREE.Mesh(
    new THREE.BoxGeometry(175, 10, 10),
    new THREE.MeshToonMaterial({ color: 0x303030, wireframe: false}) 
  );
  meshWall2.position.z = -150;
  scene.add(meshWall2);

  const meshWall3 = new THREE.Mesh(
    new THREE.BoxGeometry(320, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x303030, wireframe: false}) // LEFT WALL
  )
  meshWall3.rotation.y -= Math.PI / 2;
  meshWall3.position.x = 100;
  meshWall3.position.z = 5;
  scene.add(meshWall3);
  
  const meshWall4 = new THREE.Mesh(
    new THREE.BoxGeometry(320, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x303030, wireframe: false}) // RIGHT WALL
    )
  meshWall4.rotation.y -= Math.PI / 2;
  meshWall4.position.x = -100;
  scene.add(meshWall4);

  // CANNON-ES WALLS /////////////////////////////

 
  const halfExtentsLarge = new CANNON.Vec3(180, 9 , 5);
  const halfExtentsXLarge = new CANNON.Vec3(200, 9 , 5);

  const wallBound1 = new CANNON.Body({
    shape: new CANNON.Box(halfExtentsXLarge),
    // material: groundMaterial,
    mass: 0,
  })
  wallBound1.position.set(0,3, 100);
  // wallBound1.quaternion.setFromEuler(0, 0 , -Math.PI/2)   //WHITE
  world.addBody(wallBound1);
  
  const wallBound2 = new CANNON.Body({
    mass: 0, // can also be achieved by setting the mass to 0
    shape: new CANNON.Box(halfExtentsXLarge),
    // material: groundMaterial
  })
  // wallBound2.quaternion.setFromEuler(0, 0, -Math.PI / 2) //RED
  wallBound2.position.set(0, 3, -100)
  world.addBody(wallBound2)
  
  const wallBound3 = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(halfExtentsXLarge),
    // material: groundMaterial
  })
  wallBound3.quaternion.setFromEuler(0, -Math.PI / 2 , 0) //BLUE
  wallBound3.position.set(100, 3 , 0);
  world.addBody(wallBound3);
  
  const wallBound4= new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(halfExtentsXLarge),
    // material: groundMaterial,
  })
  wallBound4.position.set(-100, 4.5 , 0);
  // wallBound4.quaternion.setFromEuler(0, -Math.PI / 2, 0);  
  wallBound4.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI/2) // YELLOW
  world.addBody(wallBound4)

  // Make sure to use correct +- sign for plane so that plane is facing up. Affects gravity...
  // wallBound4.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI/2) ^^ SAME THING ^^


  // Smashable walls
  const cubeWidth = 2;
  const meshCube1 = new THREE.BoxGeometry(cubeWidth, cubeWidth, cubeWidth);

  const redMaterial = new THREE.MeshToonMaterial( {color: 0X800000 } );
  const blueMaterial = new THREE.MeshToonMaterial( {color: 0X0000ff } );
  const pinkMaterial = new THREE.MeshToonMaterial( {color: 0Xffc0cb } );
  const whiteMaterial = new THREE.MeshToonMaterial( {color: 0Xffffff } );
  const yellowMaterial = new THREE.MeshToonMaterial( {color: 0Xffff00 } );
  const greenMaterial = new THREE.MeshToonMaterial( {color: 0X00ff00 } );


  const threeCube1 = new THREE.Mesh(meshCube1, redMaterial);
  const threeCube2 = new THREE.Mesh(meshCube1, blueMaterial);
  const threeCube3 = new THREE.Mesh(meshCube1, pinkMaterial);
  const threeCube4 = new THREE.Mesh(meshCube1, whiteMaterial);
  const threeCube5 = new THREE.Mesh(meshCube1, yellowMaterial);
  const threeCube6 = new THREE.Mesh(meshCube1, greenMaterial);

  scene.add(threeCube1);
  scene.add(threeCube2);
  scene.add(threeCube3);
  scene.add(threeCube4);
  scene.add(threeCube5);
  scene.add(threeCube6);

  // threeCube1.position.set(0, 1.5, -78);
  // threeCube2.position.set(1.5, 1.5, -78);
  // threeCube3.position.set(-1.5, 1.5, -78);
  // threeCube4.position.set(0.75, 3.0, -78);
  // threeCube5.position.set(-.75, 3.0, -78);
  // threeCube6.position.set(0, 4.5, -78);
 
 const halfExtentsCube = new CANNON.Vec3(cubeWidth -.9, cubeWidth -.9 , cubeWidth -.9);
 const cubeMass = 50;

  const canCube1 = new CANNON.Body({
    mass: cubeMass,
    shape: new CANNON.Box(halfExtentsCube),
    material: wheelMaterial
  })
  const canCube2 = new CANNON.Body({
    mass: cubeMass,
    shape: new CANNON.Box(halfExtentsCube),
    material: wheelMaterial
  })
  const canCube3 = new CANNON.Body({
    mass: cubeMass,
    shape: new CANNON.Box(halfExtentsCube),
    material: wheelMaterial
  })
  const canCube4 = new CANNON.Body({
    mass: cubeMass,
    shape: new CANNON.Box(halfExtentsCube),
    material: wheelMaterial
  })
  const canCube5 = new CANNON.Body({
    mass: cubeMass,
    shape: new CANNON.Box(halfExtentsCube),
    material: wheelMaterial
  })
  const canCube6 = new CANNON.Body({
    mass: cubeMass,
    shape: new CANNON.Box(halfExtentsCube),
    material: wheelMaterial
  })
  
  world.addBody(canCube1);
  world.addBody(canCube2);
  world.addBody(canCube3);
  world.addBody(canCube4);
  world.addBody(canCube5);
  world.addBody(canCube6);

  canCube1.position.set(0, cubeWidth, -78);
  canCube2.position.set(cubeWidth + 0.3, cubeWidth, -78);
  canCube3.position.set(-cubeWidth - 0.3, cubeWidth, -78);
  canCube4.position.set((cubeWidth/2) + 0.3, (cubeWidth * 2), -78);
  canCube5.position.set(-(cubeWidth/2) - 0.3, (cubeWidth * 2), -78);
  canCube6.position.set(0, (cubeWidth * 3), -78);


  // PORTFOLIO AREA ///////////////////////////////

  // const legGeo = new THREE.BoxGeometry(1, 8, 1);
  // const legMater = new THREE.MeshToonMaterial({color: 0X2D2E2D});
  // const leg1 = new THREE.Mesh(legGeo, legMater);
  // leg1.position.set(0, 4, 190);
  // scene.add(leg1);

  // const leg2 = new THREE.Mesh(legGeo, legMater);
  // scene.add(leg2);
  // leg1.add(leg2);
  // leg2.position.x = -7;

  // const shaftGeo = new THREE.BoxGeometry(8, 1, 1);
  // const shaft1 = new THREE.Mesh(shaftGeo, legMater);
  // scene.add(shaft1);
  // leg1.add(shaft1);
  // shaft1.position.y = 4;
  // shaft1.position.x = -3.5;

  // const shaft2 = new THREE.Mesh(shaftGeo, legMater);
  // scene.add(shaft2);
  // leg1.add(shaft2);
  // shaft2.position.y = -4;
  // shaft2.position.x = -3.5;

  // const interactGeo = new THREE.BoxGeometry(8, 1, 4);
  // const interact1 = new THREE.Mesh(interactGeo, legMater);
  // scene.add(interact1);
  // leg1.add(interact1);
  // interact1.position.y = -4.5;
  // interact1.position.z = -16;
  // interact1.position.x = -3.5;

  ////////////////////////////////////////////////



  //PROPS/////////////////////////////////////////////
    
  let radius = 3 // m
  const geometry6 = new THREE.SphereGeometry(radius)
  const material6 = new THREE.MeshToonMaterial({color: '#191970', emissiveIntensity: 0.6, lightMapIntensity: 0.6})
  const ballMesh = new THREE.Mesh(geometry6, material6)
  scene.add(ballMesh)
  const ballBody = new CANNON.Body({
    mass: 10, // kg
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
  mass: 10,
  shape: shape,
  material: wheelMaterial
})

carBody.position.set(-10, 6, -10);
world.addBody(carBody);

const {carX, carY, carZ} = {carX: 0, carY: .3, carZ: -130 };
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

const arrowMesh = new THREE.MeshNormalMaterial({color: 0xFF00FF, opacity: 0.2});

const goalGeo = new THREE.BoxGeometry(40, 15, 15, 1, 1, 10);
const goalMater = new THREE.MeshToonMaterial({color: 0x00FF00, wireframe: true});
const goalFar = new THREE.Mesh(goalGeo, goalMater);
goalFar.position.set(0, 2.5, 180);
scene.add(goalFar);
console.log(goalFar);

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

let explode = false;

const textLoader = new THREE.FontLoader();

loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

	const geometry = new THREE.TextGeometry( 'Goal!', {
		font: THREE.Font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
} );

scene.add()

function updatePositionForCamera() {
  const dx = Math.abs(torus.position.x - car.position.x);
  const dz = Math.abs(torus.position.z - car.position.z);
  const goalx = Math.abs(goalFar.position.x - ballMesh.position.x);
  const goalz = Math.abs(goalFar.position.z - ballMesh.position.z);

  if (dz < 2 && dx < 2 ){
      torus.material.color.setHex( 0xffffff );
      // torus.geometry = new THREE.TorusGeometry( 3, 1, 3, 10 ) works great
      userScore += 10;
      shrink = true;
      setTimeout(function (){ 
        const selected = scene.getObjectById(torus.id);
        scene.remove(selected);
      }, 1000);
  }

  if(goalx < 13 && goalz < 13){
    const select = scene.getObjectById(ballMesh.id);
    userScore += 1000;
    explode = true;
    setTimeout(function(){
      ballMesh.position.set(0,0,0);
      ballBody.position.set(0,0,0)
      scene.remove(select); 
      world.removeBody(ballBody);
    }, 1500)

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
  const slide3 = document.getElementById('slide-3');
  const next = document.getElementById('next');
  const next2 = document.getElementById('next2');

  const slide4 = document.getElementById('slide-4');
  const next3 = document.getElementById('next3');

  const viewPhysics = document.getElementById('enable-physics');
  let enablePhysics = false;

    viewPhysics.addEventListener('click', () => {
    enablePhysics = !enablePhysics;
  })

  const viewFullscreen = document.getElementById('view-fullscreen');
  let clicked = 1;
  const message = document.getElementById('message');

  // viewPhysics.addEventListener('click', () => {
  //   enablePhysics = !enablePhysics;
  // })

  cancle.addEventListener('click', 
  function(){
    welcomeMenu.classList.remove('display');
    welcomeMenu.classList.add('hidden');
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

  next.addEventListener('click', () => {
    // welcomeMenu.classList.remove('display');
    // welcomeMenu.classList.add('hidden');
    slide2.classList.remove('display');
    slide2.classList.add('hidden');
    slide3.classList.remove('hidden');
    slide3.classList.add('display');
    next.classList.remove('display')
    next.classList.add('hidden')
    next2.classList.remove('hidden')
    next2.classList.add('display')
  })

  next2.addEventListener('click', () => {
    // welcomeMenu.classList.remove('display');
    // welcomeMenu.classList.add('hidden');
    slide3.classList.remove('display');
    slide3.classList.add('hidden');
    slide4.classList.remove('hidden');
    slide4.classList.add('display');
    next2.classList.remove('display')
    next2.classList.add('hidden')
    next3.classList.remove('hidden')
    next3.classList.add('display')
  })

  next3.addEventListener('click', () => {
    welcomeMenu.classList.remove('display');
    welcomeMenu.classList.add('hidden');
  })

  const docEle = document.documentElement;
  viewFullscreen.addEventListener('click', function(){
    if(docEle.requestFullScreen) {
      docEle.requestFullScreen();
    } else if(docEle.mozRequestFullScreen) {
      docEle.mozRequestFullScreen();
    } else if(docEle.webkitRequestFullScreen) {
      docEle.webkitRequestFullScreen()
    }
    clicked -= 1;
  })

/////////////////////////////////////

const timeStep = 1 / 60; // seconds
let lastCallTime;
const score = document.getElementById('score-holder');
let phiLen = 3.2;
let thetaLen = 6.3;

// MAKE ARROW TURN TO TARGET////////////////////////////////////////////////////
const boxArrGeo = new THREE.BoxGeometry(0.25, 0.25, 1.5);
const boxArrow = new THREE.Mesh(boxArrGeo, arrowMesh);

const coneGeo = new THREE.ConeGeometry( 0.3, 0.3, 4 );
const coneMater = new THREE.MeshNormalMaterial({color: 0xFF00FF, opacity: 0.2});
const arrowHead = new THREE.Mesh(coneGeo, coneMater);
arrowHead.rotation.x = Math.PI / 2
scene.add(arrowHead);
boxArrow.add(arrowHead);
arrowHead.position.z += 0.9
scene.add(boxArrow);

/////////////////////////////////////////////////////
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
    
    camera.position.z = car.position.z - 6;
    // camera.position.x = car.position.x - 4;
    // camera.position.z = car.position.z;
    camera.position.x = car.position.x;
    camera.lookAt(car.position);
	}
  if (keyboard['KeyW']){
    camera.position.y = 30;
    camera.lookAt(car);
  }else{
    camera.position.y = 3;
  }
  if (keyboard['KeyE']){
    camera.lookAt(ballMesh)
  }

	if (keyboard["ArrowDown"]){
    car.position.z -= Math.sin(car.rotation.y) * player.speed;
		car.position.x -= -Math.cos(car.rotation.y) * player.speed;
    camera.position.z = car.position.z - 6;
    // camera.position.x = car.position.x - 4;
    // camera.position.z = car.position.z;
    camera.position.x = car.position.x;
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
      player.speed = 0.80
      angle = 0.03;
  } else {
      player.speed = .35
      angle = 0.02;
  }

  torus.rotation.y += 0.01;

  boxArrow.position.copy(car.position)
  boxArrow.position.y = 3;
  boxArrow.lookAt(ballMesh.position)

  carBody.position.copy(car.position);
  carBody.quaternion.copy(car.quaternion);

  // if (enablePhysics){
  //   cannonDebugger(scene, world.bodies);
  // }
  
  if(!explode){
    ballMesh.position.copy(ballBody.position);
    ballMesh.quaternion.copy(ballBody.quaternion);
  }

  cube.position.copy(cubeBody.position);
  cube.quaternion.copy(cubeBody.quaternion);

  threeCube1.position.copy(canCube1.position);
  threeCube1.quaternion.copy(canCube1.quaternion);
  threeCube2.position.copy(canCube2.position);
  threeCube2.quaternion.copy(canCube2.quaternion);
  threeCube3.position.copy(canCube3.position);
  threeCube3.quaternion.copy(canCube3.quaternion);
  threeCube4.position.copy(canCube4.position);
  threeCube4.quaternion.copy(canCube4.quaternion);
  threeCube5.position.copy(canCube5.position);
  threeCube5.quaternion.copy(canCube5.quaternion);
  threeCube6.position.copy(canCube6.position);
  threeCube6.quaternion.copy(canCube6.quaternion);
  

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

  if(explode){
    ballMesh.geometry = new THREE.SphereGeometry(radius += .8, 32, 32, 0, phiLen -= .045, 0, thetaLen -= .045 )
    ballMesh.rotation.y += .15;
    ballMesh.position.y += 0.1
    
    ballMesh.material.color.setHex(colors[Math.floor(Math.random() * 6)])
  }

  score.innerHTML =`Score: ${userScore}`;

  camera.lookAt(car.position);

  renderer.render( scene, camera );
}
animate()