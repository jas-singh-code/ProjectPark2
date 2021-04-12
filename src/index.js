import * as THREE from 'three';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// world = new OIMO.World({ 
//     timestep: 1/60, 
//     iterations: 8, 
//     broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
//     worldscale: 1, // scale full world 
//     random: true,  // randomize sample
//     info: false,   // calculate statistic or not
//     gravity: [0,-9.8,0] 
// });

const container = document.querySelector('#scene-canvas');
// const ctx = container.getContext('2d');
// // ctx.fillRect(25, 25, 100, 100);
// //     ctx.clearRect(45, 45, 60, 60);
// //     ctx.strokeRect(50, 50, 50, 50);


let keyboard = {}
let player = { height: 1.8, speed: 0.15 };
let meshFloor;
let angle = 0.02;
let collisions = [];
let box;
let stopMovement = false;
let rotationPoint = new THREE.Object3D();
rotationPoint.position.set( 0, 0, 0 );

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

scene.add(rotationPoint);

const loader = new GLTFLoader();
let car = undefined;
let animations = undefined;
loader.load( 'src/car_sel.glb', function ( gltf ) {
  	car = gltf.scene;
	animations = gltf.animations; // AnimationClip {name: "EmptyAction.004", ...
	// console.log(animations);
	car.scale.set(0.2, 0.2, 0.3);
    car.rotateY( 3 * Math.PI/2);
    console.log(car);
    // calculateCollisionPoints(car);
    box = new THREE.Box3().setFromObject( car );
	  scene.add( car );
    rotationPoint.add(car);


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
torus.position.x = 10;
torus.position.y = 0;
torus.position.z = 10;
scene.add( torus );
console.log(torus);
calculateCollisionPoints(torus);
///ring

meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100, 100, 100),
	new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
)
meshFloor.rotation.x -= Math.PI /2;
meshFloor.position.y -= .9
scene.add(meshFloor);

// function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
//    object.rotateX(THREE.Math.degToRad(degreeX));
//    object.rotateY(THREE.Math.degToRad(degreeY));
//    object.rotateZ(THREE.Math.degToRad(degreeZ));
// }


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
    // fixed distance from camera to the object
    const dist = 8;
    const cwd = new THREE.Vector3();
    
    
    // camera.getWorldDirection(cwd.position);
    // camera.getWorldDirection(car.position);
    
    // car.position.multiplyScalar(dist);
    // car.position.add(camera.position);
    // car.position.y -= 6;
    // car.position.z = 2;
    // cwd.add(car.position);
    // camera.position.add(car.position);
const dx = Math.abs(torus.position.x - car.position.x);
const dz = Math.abs(torus.position.z - car.position.z);

    if (dz < 2 && dx < 2 ){
        torus.material.color.setHex( 0xffffff );
    } else {
         torus.material.color.setHex( 0x000000 )
    }
    
	
    // camera.position.set( car.position);
    // camera.getWorldDirection(car.position);
    // camera.Translate(0, 0, -10); // where `r` is the desired distance
    
}
// COLLISION DECT


function calculateCollisionPoints( mesh, scale, type = 'collision' ) { 
  // Compute the bounding box after scale, translation, etc.
  let bbox = new THREE.Box3().setFromObject(mesh);
 
  let bounds = {
    type: type,
    xMin: bbox.min.x,
    xMax: bbox.max.x,
    yMin: bbox.min.y,
    yMax: bbox.max.y,
    zMin: bbox.min.z,
    zMax: bbox.max.z,
  };
 
  collisions.push( bounds );
}

function detectCollisions() {
  // Get the user's current collision area.
  if (car){
      box = new THREE.Box3().setFromObject( car );
  }
    // console.log(rotationPoint, "rotationpoint")

  var bounds = {
    xMin: rotationPoint.position.x - box.min.x,
    xMax: rotationPoint.position.x + box.max.x,
    yMin: rotationPoint.position.y - box.min.y,
    yMax: rotationPoint.position.y + box.max.y,
    zMin: rotationPoint.position.z - box.min.z,
    zMax: rotationPoint.position.z + box.max.z,
  };
 
  // Run through each object and detect if there is a collision.
  for ( let index = 0; index < collisions.length; index ++ ) {
 
    if (collisions[ index ].type == 'collision' ) {
      if ( ( bounds.xMin <= collisions[ index ].xMax && bounds.xMax >= collisions[ index ].xMin ) &&
         ( bounds.yMin <= collisions[ index ].yMax && bounds.yMax >= collisions[ index ].yMin) &&
         ( bounds.zMin <= collisions[ index ].zMax && bounds.zMax >= collisions[ index ].zMin) ) {
        // We hit a solid object! Stop all movements.
        stopMovement = true;
 
        // Move the object in the clear. Detect the best direction to move.
        if ( bounds.xMin <= collisions[ index ].xMax && bounds.xMax >= collisions[ index ].xMin ) {
          // Determine center then push out accordingly.
          let objectCenterX = ((collisions[ index ].xMax - collisions[ index ].xMin) / 2) + collisions[ index ].xMin;
          let playerCenterX = ((bounds.xMax - bounds.xMin) / 2) + bounds.xMin;
          let objectCenterZ = ((collisions[ index ].zMax - collisions[ index ].zMin) / 2) + collisions[ index ].zMin;
          let playerCenterZ = ((bounds.zMax - bounds.zMin) / 2) + bounds.zMin;
 
          // Determine the X axis push.
          if (objectCenterX > playerCenterX) {
            rotationPoint.children[0].position.x -= 6;
            camera.position.x -= 1;
            console.log('objcentX', car.position, rotationPoint, camera.position);
          } else {
            rotationPoint.children[0].position.x += 6;
            camera.position.x += 1;
            console.log('objcentX else', car.position, rotationPoint, camera.position);

          }
        }
        if ( bounds.zMin <= collisions[ index ].zMax && bounds.zMax >= collisions[ index ].zMin ) {
          // Determine the Z axis push.
          if (objectCenterZ > playerCenterZ) {
          rotationPoint.children[0].position.z -= 1;
          camera.position.z -= 1;
          console.log('objcentZ', car.position, rotationPoint.position, camera.position);

          } else {
            rotationPoint.children[0].position.z += 1;
            camera.position.z += 1;
            console.log('objcentZ else ', car.position, rotationPoint, camera.position);
          }
        }
      }
    }
  }
}


// COLLISION DECT


// animaition loop 60frames/sec
function animate() {
    requestAnimationFrame( animate );
    updatePositionForCamera(camera);
    if ( collisions.length > 0 ) {
        detectCollisions();
    };
	if (keyboard["ArrowUp"]){
		// camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		// camera.position.z += -Math.cos(camera.rotation.y) * player.speed;

        car.position.z += Math.sin(car.rotation.y) * player.speed;
	    	car.position.x += -Math.cos(car.rotation.y) * player.speed;
        
        camera.position.z = car.position.z - 4;
        camera.position.x = car.position.x - 4;
        camera.lookAt(car.position);
	}

    if (keyboard["KeyW"]){
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		    camera.position.z += Math.cos(camera.rotation.y) * player.speed;
    }

	if (keyboard["ArrowDown"]){
		// camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		// camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;

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
	renderer.render( scene, camera );
    
}
animate()