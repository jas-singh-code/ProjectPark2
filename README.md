# Background & Overview 

Project Park is an open-world 3-d map (think HD pixel/block art) filled with project & resume related information about the author-Jaspreet Singh as well as fun puzzles. Users will be assigned an avatar and be able to navigate throughout the world as that avatar and guided by post signs. Users will also have to pass obstacles and fun puzzles to unlock some paths. One path for example might lead the user to my projects display area where they can see detailed information and links to all my projects with fun facts bugs and experences during development. Another path might be an "about me" section that lists my background and hobbies/ interests. In all, when you think ProjectPark, think self-marketing, resume display, and skill display, all on one fun platform, lightenting the experince for both parties!


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
