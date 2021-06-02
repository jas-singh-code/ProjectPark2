import CannonDebugRenderer from './CannonDebugRenderer';
import THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Game{
    constructor(){
        this.init();
    }

    init(){
        const game = this;

        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0,0,0)
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 500 )
        this.camera.position.set(0,6, 0);

        const container = document.querySelector('#scene-canvas');
        this.renderer = new THREE.WebGLRenderer({canvas: container, alpha: true});
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.shadowMap.enabled = true;
        document.body.append( this.renderer.domElement );
        this.initPhysics();
        this.loadCar();
        
    }

    addTorus(){
        const geometry3 = new THREE.TorusGeometry( 5, 2, 16, 100 );
        const material3 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const torus = new THREE.Mesh( geometry3, material3 );
        torus.position.x = 10;
        torus.position.y = 0;
        torus.position.z = 10;
        this.scene.add( torus );
    }

    lights(){
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemiLight.position.set(0, 50, 0);
        // Add hemisphere light to scene
        this.scene.add(hemiLight);

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

        this.scene.add(dirLight);
    }

    loadCar(){
        const loader = new GLTFLoader();
        let car = undefined;
        let box;
        let animations = undefined;
        loader.load( 'src/car_sel.glb', function ( gltf ) {
            car = gltf.scene;
            animations = gltf.animations; 
            car.scale.set(0.3, 0.3, 0.4);
            car.rotateY( 3 * Math.PI/2);
            console.log(car);
            box = new THREE.Box3().setFromObject( car );
            this.scene.add( car );


        }, undefined, function ( error ) {

            console.log( error );

        }, function (){
            car = gltf.scene;
        });
    }

    initPhysics(){
        const world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -10, 0), // m/s²
        })
        this.world = world;
        this.fixedTimeStep = 1.0/60.0;
        // this.damping = 0.01;

        this.broadphase = new CANNON.NaiveBroadphase();
        this.debugRenderer = new THREE.CannonDebugRenderer(this.scene, this.world);
        
        const groundShape = new CANNON.Plane()
        const groundMaterial = new CANNON.Material();
        const groundBody = new CANNON.Body({mass: 0, material: groundMaterial});
        groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3(1,0,0), -Math.PI/2);
		groundBody.addShape(groundShape);
		world.add(groundBody);

        let meshFloor;
        meshFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 100, 100),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true})
        )
        meshFloor.rotation.x -= Math.PI /2;
        meshFloor.position.y -= 1
        scene.add(meshFloor);

        this.groundMaterial = groundMaterial;
        this.animate();
    }

    animate(){
        const game = this;
        requestAnimationFrame( function(){ game.animate(); } );
        let lastCallTime;
        // this.world.step(this.fixedTimeStep)

        const time = performance.now() / 1000; // seconds
        if (!lastCallTime) {
            this.world.step(this.fixedTimeStep)
        } else {
            const dt = time - lastCallTime
            this.world.step(this.fixedTimeStep, dt)
        }
        lastCallTime = time; 
    }
}

export default Game;