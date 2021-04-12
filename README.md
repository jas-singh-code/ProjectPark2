# Background & Overview 

Project Park is a 3-d open world game where users can stroll though a park populated with the author's presonal project displays and resume information. Users start by learning the controlls in the stagging area and move onto the first area- Projects. Here the user can see a list with detailed information about each of the author's projects and any important takeways of each project along with bugs, funfacts, and a showcase of a particular code.

To enter the Projects area however, users must solve a memory game puzzle. Ater solving the puzzle the user will be awarded props to play with to makw thier stroll through the park more enjoyable and interactive.

Once satisfied from thier stroll around projects area, users might find the 'About Me' area, or the 'Resume' area, both located conveinently next to the projects area. To enter the resume area users will have to solve another puzzle, however, the about me area of open to all. The puzzle for the Resume area is another easy, shuffle cups game where users will have to track the ball under the cup. After solving this puzzle they are allowed entry. This area will contain information about the resume of the author, past education, experince, skills, and job experiences and awards nd of course any internet presence in the form of links and pictures.

The about me area, free to enter, is the last area users can go to. It contains information that the author wants you to know about related to him. It includes information about his hobbies, passions, side projects, bussiness ventures and of course, funfacts. 

Finally, the game never ends but there is an option to end the game, after with, a modal with the authors' personal links are displayed.

1. [Background and Overview](https://github.com/jas-singh-code/ProjectPark2/wiki/Background-and-Overview) 
2. [Functionality and MVPs](https://github.com/jas-singh-code/ProjectPark2/wiki/Functionality-and-MVPs)
3. [Architecture and Technology](https://github.com/jas-singh-code/ProjectPark2/wiki/Architecture-and-Technology)
4. [Wireframe](https://wireframe.cc/pro/pp/f694d0636428749)
5. [Implementation Timeline](https://github.com/jas-singh-code/ProjectPark/wiki/Implementation-Timeline)



# Functionality and MVPs

In ProjectPark, users will be able to:
* Interact with the game by strolling through a collage of Resume and project related information 
* Play around with various objects they will encounter through their path like:
   * Bouncy balls
   * Breakable walls
   * (bonus) Pets that follow you around and direct you somewhere(if you want to go to the projects centre, education centre, about me centre...)
* solve puzzles which will allow them to progress throughout the app.
* (bonus) win prizes based on points at the end.

In addition users will also be able to:
* choose an avatar before starting the game.
* choose a background tune for thier stroll.


# Architecture and Technology

The following is a list of technologies used in this project:
1. `Javascript`       -for game logic and DOM minipulation.
2. `HTML5` & `Canvas` -for effects rendering & 2d objects/backgrounds.
3. `three.js`         -for rendering 3d objects.
4. `Webpack`          -for bundeling js files

Architechture:
`Canvas.js` file will be used to create logic for changing dynamics of surfaces and 2d objects and puzzles as well as effects when a user solves their puzzle.
`animate.js` file will be used to create 3d objects and simple logic for how they will interact with the DOM.


# ProjectPark Wireframe:

[Wireframe](https://wireframe.cc/pro/pp/f694d0636428749)


# Implementation Timeline:

`Day 1` Build the Canvas layout
1. Read through canvas doumentation and try to set up backdrop/ platform for users to walk one/ paths/ puzzles to lay.
2. Create borders for where all areas and paths will be. There will be 4 centre, 2 puzzle and many objects throught the whole map. Make a layout on the site to accomadate this:
    * starting centre- where users can take a moment and learn the moves for the game(up down left right jump)
    * about me centre- fun facts about me. My hobbies, interests and fun facts
    * Projects centre- display link to all projects, show bugs encountered, technologies learned, and fun facts.
    * resume centre- display my resume along with pictures/ links to internet presence and LinkedIN

    * projects Puzzle- simple memory game where users will see a combination of colors each round, and have to input that combination each round. Each round adds 1 more color to the combination.
    * Resume Puzzle- simple game of shuffle cups where users will have to find where the ball under the cup is.

`Day 2` create the stagging centre and teach the user the controls.
1. show the controls modal which goes away after the user presses all the buttons
2. Read into the three.js documentation and understand how to use and implement it
3. create the avatar for the user.

`Day 3` Create the projects puzzle and wall/door to unlock the Projects Centre
1. Puzzle logic in puzzles.js
2. three.js should be minipulated to render logic.
3. should be time based

`Day 4` Create the projects area
1 having the puzzle logic done, start placing peices of links, images, and text for your projects centre.

`Day 5` Add interactive objects the user can minuplate
1. Add a bouncy ball, 
2. breakable walls
3. tranpolines

`Day 6` Create the about me centre using three.js
1. continue to read into three.js and create a simple about me area as a warmup. Interactivity should be minimal, focus more on understanding how to implement three.js
2. Add writing, pictures, props.

`Day 7` finishing touches
