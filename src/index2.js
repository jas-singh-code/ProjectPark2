// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { GUI } from '/jsm/libs/dat.gui.module'
// const gui = new GUI()

// const container = document.querySelector('#scene-canvas');

// let keyboard = {}
// let player = { height: 1.8, speed: 0.5 };
// let meshFloor;

// //defining 3 parameters
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 500 );
// let helper = new THREE.CameraHelper(camera);
// scene.add(helper);
// const renderer = new THREE.WebGLRenderer({canvas: container, alpha: true});
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColor( 0x000000, 0 ); // the default
// renderer.shadowMap.enabled = true;
// document.body.append( renderer.domElement );

// // Add lights
// let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
// hemiLight.position.set(0, 50, 0);
// // Add hemisphere light to scene
// scene.add(hemiLight);

// let d = 8.25;
// let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
// dirLight.position.set(-8, 12, 8);
// dirLight.castShadow = true;
// dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
// dirLight.shadow.camera.near = 0.1;
// dirLight.shadow.camera.far = 1500;
// dirLight.shadow.camera.left = d * -1;
// dirLight.shadow.camera.right = d;
// dirLight.shadow.camera.top = d;
// dirLight.shadow.camera.bottom = d * -1;
// // Add directional Light to scene
// scene.add(dirLight);


// /// lines
// camera.position.set(1,player.height, 10);
// camera.lookAt(new THREE.Vector3(20, player.height, 0));

// const material2 = new THREE.LineBasicMaterial({color: 0x0000ff})
// const points = [];
// points.push( new THREE.Vector3( -10, 0, 4 ) );
// points.push( new THREE.Vector3( 0, 10, 4 ) );
// points.push( new THREE.Vector3( 10, 0, 4 ) );
// const geometry2 = new THREE.BufferGeometry().setFromPoints( points );
// const line = new THREE.Line( geometry2, material2 );
// // scene.add( line );
// ///lines

// //ring
// const geometry3 = new THREE.TorusGeometry( 5, 2, 16, 100 );
// const material3 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// const torus = new THREE.Mesh( geometry3, material3 );
// // scene.add( torus );
// ///ring

// meshFloor = new THREE.Mesh(
// 	new THREE.PlaneGeometry(100, 100, 100, 100),
// 	new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
// )
// meshFloor.rotation.x -= Math.PI /2;
// meshFloor.position.y -= .9
// scene.add(meshFloor);

// function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
//    object.rotateX(THREE.Math.degToRad(degreeX));
//    object.rotateY(THREE.Math.degToRad(degreeY));
//    object.rotateZ(THREE.Math.degToRad(degreeZ));
// }




// function updatePositionForCamera(camera) {
//     // fixed distance from camera to the object
//     const dist = 5;
//     const cwd = new THREE.Vector3();
    
//     camera.getWorldDirection(cwd);
    
//     cwd.multiplyScalar(dist);
//     cwd.add(camera.position);
    
// 	if(car){
// 		car.position.set(cwd.x , cwd.y -1, cwd.z);
//     	car.setRotationFromQuaternion(camera.quaternion);
// 	}
   
// }

// class BasicCharacterController {
// 	constructor(){
// 		this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
//         this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
//         this._velocity = new THREE.Vector3(0, 0, 0);

//         this._animations = {};
//         this._input = new BasicCharacterControllerInput();
//         this._stateMachine = new CharacterFSM(new BasicCharacterControllerProxy(this._animations));
// 		this._LoadModels();
// 	}

// 	_LoadModels(){
// 		const loader = new GLTFLoader();
// 		let car = undefined;
// 		loader.load( 'src/car_sel.glb', function ( gltf ) {
// 			car = gltf.scene;
// 			car.scale.set(0.2, 0.2, 0.2);
//             this._stateMachine.SetState('idle')
// 			scene.add( car );

// 		}, undefined, function ( error ) {

// 			console.error( error );

// 		}, function (){
// 			car = gltf.scene;
// 		});
// 	}

//     Update(timeInSeconds) {
//     if (!this._target) {
//       return;
//     }

//     this._stateMachine.Update(timeInSeconds, this._input);

//     const velocity = this._velocity;
//     const frameDecceleration = new THREE.Vector3(
//         velocity.x * this._decceleration.x,
//         velocity.y * this._decceleration.y,
//         velocity.z * this._decceleration.z
//     );
//     frameDecceleration.multiplyScalar(timeInSeconds);
//     frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
//         Math.abs(frameDecceleration.z), Math.abs(velocity.z));

//     velocity.add(frameDecceleration);

//     const controlObject = this._target;
//     const _Q = new THREE.Quaternion();
//     const _A = new THREE.Vector3();
//     const _R = controlObject.quaternion.clone();

//     const acc = this._acceleration.clone();
//     if (this._input._keys.shift) {
//       acc.multiplyScalar(2.0);
//     }

//     if (this._stateMachine._currentState.Name == 'dance') {
//       acc.multiplyScalar(0.0);
//     }

//     if (this._input._keys.forward) {
//       velocity.z += acc.z * timeInSeconds;
//     }
//     if (this._input._keys.backward) {
//       velocity.z -= acc.z * timeInSeconds;
//     }
//     if (this._input._keys.left) {
//       _A.set(0, 1, 0);
//       _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
//       _R.multiply(_Q);
//     }
//     if (this._input._keys.right) {
//       _A.set(0, 1, 0);
//       _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
//       _R.multiply(_Q);
//     }

//     controlObject.quaternion.copy(_R);

//     const oldPosition = new THREE.Vector3();
//     oldPosition.copy(controlObject.position);

//     const forward = new THREE.Vector3(0, 0, 1);
//     forward.applyQuaternion(controlObject.quaternion);
//     forward.normalize();

//     const sideways = new THREE.Vector3(1, 0, 0);
//     sideways.applyQuaternion(controlObject.quaternion);
//     sideways.normalize();

//     sideways.multiplyScalar(velocity.x * timeInSeconds);
//     forward.multiplyScalar(velocity.z * timeInSeconds);

//     controlObject.position.add(forward);
//     controlObject.position.add(sideways);

//     oldPosition.copy(controlObject.position);

//     if (this._mixer) {
//       this._mixer.update(timeInSeconds);
//     }


// }

// class BasicCharacterControllerInput {
// 	constructor(){
// 		this._Init()
// 	};

// 	_onKeyDown(event){
//         switch (event.code) {
//             case "ArrowUp":
//                 this._keys.foward = true;
//                 break;
//             case "ArrowDown":
//                 this._keys.backward = true;
//                 break;
//             case "ArrowLeft":
//                 this._keys.left = true;
//                 break;
//             case "ArrowRight":
//                 this._keys.right = true;
//                 break;
//         }
// 	};

// 	onKeyUp(event){
// 	    switch (event.code) {
//             case "ArrowUp":
//                 this._keys.foward = false;
//                 break;
//             case "ArrowDown":
//                 this._keys.backward = false;
//                 break;
//             case "ArrowLeft":
//                 this._keys.left = false;
//                 break;
//             case "ArrowRight":
//                 this._keys.right = false;
//                 break;
//         }
// 	};

// 	_Init(){
//         this._keys = {
//             foward: false, 
//             backward: false,
//             left: false,
//             right: false
//         }

// 		document.body.addEventListener('keydown', (e) => this.__onKeyDown(e), false);
// 		document.body.addEventListener('keyup', (e) => this._onKeyUp(e), false);
// 	}

    
// }

// class FiniteStateMachine {
//   constructor() {
//     this._states = {};
//     this._currentState = null;
//   }

//   _AddState(name, type) {
//     this._states[name] = type;
//   }

//   SetState(name) {
//     const prevState = this._currentState;
    
//     if (prevState) {
//       if (prevState.Name == name) {
//         return;
//       }
//       prevState.Exit();
//     }

//     const state = new this._states[name](this);

//     this._currentState = state;
//     state.Enter(prevState);
//   }

//   Update(timeElapsed, input) {
//     if (this._currentState) {
//       this._currentState.Update(timeElapsed, input);
//     }
//   }
// };

// class CharacterFSM extends FiniteStateMachine{
// 	constructor(proxy){
// 		super();
// 		this._proxy = proxy;
// 		this._Init();
// 	}

// 	_Init() {
// 		this._AddState('idle', IdleState);
// 		this._AddState('drive', driveState);
// 	}
// }

// class State {
//   constructor(parent) {
//     this._parent = parent;
//   }

//   Enter() {}
//   Exit() {}
//   Update() {}
// };

// class IdleState extends State{
// 	constructor(parent) {
//     super(parent);
//   }

//   get Name() {
//     return 'idle';
//   }

//   Exit() {
//   }

//   Update(_, input) {
//     if (input._keys.forward || input._keys.backward) {
//       this._parent.SetState('drive');
//     }
//   }
// }

// class DriveState extends State {
//   constructor(parent) {
//     super(parent);
//   }

//   get Name() {
//     return 'drive';
//   }

//   Exit() {
//   }

//   Update(timeElapsed, input) {
//     if (input._keys.forward || input._keys.backward) {
//       return;
//     }

//     this._parent.SetState('idle');
//   }
// };


// if (car){
// 	const carFolder = gui.addFolder("car")
// 	carFolder.add(car.rotation, "x", 0, Math.PI * 2, 0.01)
// 	carFolder.add(car.rotation, "y", 0, Math.PI * 2, 0.01)
// 	carFolder.add(car.rotation, "z", 0, Math.PI * 2, 0.01)
// 	carFolder.open()
// 	const cameraFolder = gui.addFolder("Camera")
// 	cameraFolder.add(camera.position, "z", 0, 10, 0.01)
// 	cameraFolder.open()
// }

// // animaition loop 60frames/sec
// function animate() {
// 	requestAnimationFrame( animate );
// 	if (keyboard["ArrowUp"]){
// 		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
// 		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
// 	}

// 	if (keyboard["ArrowDown"]){
// 		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
// 		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
// 	}

// 	if (keyboard["ArrowLeft"]){
// 		camera.rotation.y += Math.PI * 0.01;
// 	}
// 	if (keyboard["ArrowRight"]){
// 		camera.rotation.y -= Math.PI * 0.01;
// 	}
// 	updatePositionForCamera(camera);
//     // car.rotation.y += 0.01;
//     // torus.rotation.y += 0.01;
// 	renderer.render( scene, camera );
// }
// animate()