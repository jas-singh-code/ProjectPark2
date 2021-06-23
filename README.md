# Background & Overview 

Project Park is a 3-d open world game inspired from Rocket League. Users start by learning the controlls in the stagging area and move onto the playground where there is a soccer net and a ball. If the user makes the goal, the ball explodes and the user score is added.

Finally, the game never ends but there is an option to end the game, after with, a modal with the authors' personal links are displayed.

<h1 align="center" ><a href='https://jas-singh-code.github.io/ProjectPark2/'>
  View the Live Site Here! </a>
</h1>

<!-- # [View the Live Site Here!](https://jas-singh-code.github.io/ProjectPark2/) -->

1. [Background and Overview](https://github.com/jas-singh-code/ProjectPark2/wiki/Background-and-Overview) 
2. [Functionality and MVPs](https://github.com/jas-singh-code/ProjectPark2/wiki/Functionality-and-MVPs)
3. [Architecture and Technology](https://github.com/jas-singh-code/ProjectPark2/wiki/Architecture-and-Technology)
4. [Wireframe](https://wireframe.cc/pro/pp/f694d0636428749)
5. [Implementation Timeline](https://github.com/jas-singh-code/ProjectPark/wiki/Implementation-Timeline)



# Functionality and MVPs

In ProjectPark, users will be able to:
* Drive a car
* Play around with various objects they will encounter through their path like:
   * Bouncy balls
   * Breakable walls
   * (bonus) Pets that follow you around and direct you somewhere(if you want to go to the projects centre, education centre, about me centre...)
* (bonus) win prizes based on points at the end.

In addition users will also be able to:
* choose an avatar before starting the game. (bonus)
* choose a background tune for thier stroll. (bonus)


# Architecture and Technology

The following is a list of technologies used in this project:
1. `Javascript`       -for game logic and DOM minipulation.
2. `HTML5` & `Canvas` -for effects rendering & 2d objects/backgrounds.
3. `three.js`         -for rendering 3d objects.
4. `cannon-es`        -Physics engine for collision response.
5. `Webpack`          -for bundeling js files.

# ProjectPark Wireframe:

[Wireframe](https://wireframe.cc/pro/pp/f694d0636428749)


# Implementation Timeline:

`Day 1` Build the Canvas layout
1. Read through canvas doumentation and try to set up canvas backdrop.
2. Set up scene, renderer, lighting, and game loop

`Day 2-3` create the stagging area and teach the user the controls.
1. show the controls modal which goes away after the user presses all the buttons
2. Read into the three.js documentation and understand how to use and implement it.
3. create the car for the user in Blender.

`Day 4` Create the projects area
1. Creat event handelers for car.
2. Play around with car's physics (velocity, angangular velocity, mass)

`Day 5` Add interactive objects the user can minuplate
1. add cannon-es to packages and learn controls (should be similar to THREE.js)
2. Add a bouncy ball, 
3. breakable walls

`Day 6` Create the about me centre using three.js
1. continue to read into three.js and create a simple about me area as a warmup. Interactivity should be minimal, focus more on understanding how to implement three.js
2. Add writing, pictures, props.

`Day 7` finishing touches
