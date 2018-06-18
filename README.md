## 2D - Portal

### Background and Overview

2D Portal is a puzzle-platformer game inspired by the Portal series of games. The player navigates through a series of levels by strategically placing portals in two different places and moving between them.

### Functionality & MVP

In 2D Portal, users will be able to:

- [ ] Move and jump around the map using movement keys
- [ ] Shoot portals onto walls using mouse buttons
- [ ] Move between the two portals
- [ ] See a description of the controls, and objective of the game

### Wireframes

The app will consist of the main canvas element with the gameplay elements inside, with a description of the game on the side (or potentially in modal form). This is an example of one potential view of the game:

![alt text](https://res.cloudinary.com/mwojick/image/upload/v1529314743/2D%20Portal/2D_Portal.png "2D Portal Game")


### Architecture and Technologies

This project will be implemented using the following technologies:

* HTML/CSS
* JavaScript for game physics and logic.
* HTML5 Canvas for DOM manipulation and rendering.
* Webpack to bundle up the JS files.


### Implementation Timeline

#### Over the weekend
- [x] Looked at various tutorials on basic 2D javascript platformers.
- [x] Implemented a simple canvas window with a player and objects. Has basic collision detection, arrow key event listeners, and velocity/gravity/friction attributes.

#### Day 1
- [ ] Reorganize file structure, and put elements like the player, canvas, and key mapping into different classes.
- [ ] Implement mouse controls for shooting portals from the player and switching between blue and orange.

#### Day 2
- [ ] Implement collision detection between portals and walls, and portals and players (teleport player between portals).

#### Day 3
- [ ] Add sprites and other styling to the canvas.

#### Day 4
- [ ] Add additional levels, and continue adding sprites
- [ ] Add description, and keyboard/mouse controls to the side.
