import { Object3D, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

    class Car extends Object3D{
        constructor(scene){
            super();
            this.loader = new GLTFLoader();
            this.loader.load( 'src/car4.glb', function ( gltf ) {
                this.car = gltf.scene;
                scene.add( gltf.scene );
        
            }, undefined, function ( error ) {
        
                console.error( error );
        
            } );
            this.velocity = new Vector3;
            this.displacement = new Vector3(0,0,1);
            this.position = new Vector3();
            this.speed = new Vector3(1,0,0)
        }

        update(delta){

        }

    }

export default Car;

 