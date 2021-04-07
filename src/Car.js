import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

    class Car {
        constructor(scene){
            this.loader = new GLTFLoader();
            this.loader.load( 'src/car4.glb', function ( gltf ) {
                this.move = gltf.scene;
                scene.add( gltf.scene );
        
            }, undefined, function ( error ) {
        
                console.error( error );
        
            } );
        }

    }

export default Car;

 