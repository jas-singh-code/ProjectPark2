import { Body, World } from "oimo";
const world = new World({ 
    timestep: 1/60, 
    iterations: 8, 
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: false,   // calculate statistic or not
    gravity: [0,-9.8,0] 
});

   const ground = world.add({size:[50, 10, 50], pos:[0,-5,0], density:1 });


var body = world.add({ 
    type:'sphere', // type of shape : sphere, box, cylinder 
    size:[1,1,1], // size of shape
    pos:[0,0,0], // start position in degree
    rot:[0,0,90], // start rotation in degree
    move:true, // dynamic or statique
    density: 1,
    friction: 0.2,
    restitution: 0.2,
    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
});


// update world
world.step();

    updatePositionForCamera(camera);
    // if ( collisions.length > 0 ) {
    //     detectCollisions();
    // };


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
