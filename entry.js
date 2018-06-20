
import { Test } from './lib/test';

import { colCheck, changeBoxDir,
  objectPlayerCol, objectPortalCol,
  exitPlayerCol
} from './lib/collision';

import { player, playerPos } from './lib/player';
// import { boxFunc } from './lib/boxes';
import { teleport } from './lib/teleport';
import { Canvas } from './lib/canvas';
import { Map, BLOCK_W, BLOCK_H } from './lib/maps/map';

import { map1, map2, map3,  map4, map5,
      map6, map7, map8, map9, map10
    } from './lib/maps/map_levels';

import { Sprites } from './lib/sprites';


document.addEventListener('DOMContentLoaded', () => {

  let requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;



let canvas = new Canvas("canvas"),
    keys = [],
    friction = 0.8,
    gravity = 0.7,
    maxGrav = 35,
    portalSpeed = 15;

canvas.canvas.width = canvas.width;
canvas.canvas.height = canvas.height;


//Get maps
let maps = [map1, map2, map3, map4, map5,
            map6, map7, map8, map9, map10];
let map = new Map(maps[0], 0);
map.getMap();

// Get sprites
let sprites = new Sprites();



let mainBox = {};
let altBox = {};


let portals = [];
let mainPortalColor = "blue";
let altPortalColor = "orange";

function update(){

  if (player.levelCount !== map.level) {
    map = new Map(maps[player.levelCount], player.levelCount);
    map.getMap();
    player.x = playerPos[player.levelCount].x;
    player.y = playerPos[player.levelCount].y;
  }

  // check keys
  if (keys[38] || keys[32] || keys[87]) {
      // up arrow or space or w
    if(player.grounded){
     player.grounded = false;
     player.velY = -player.speed*player.jumpMult;
    }
  }
  if (keys[39] || keys[68]) {
      // right arrow or d
      if (player.velX < player.speed) {
          player.velX += player.velOffset;
       }
  }
  if (keys[37] || keys[65]) {
      // left arrow or a
      if (player.velX > -player.speed) {
          player.velX -= player.velOffset;
      }
  }

  player.velX *= friction;
  if (player.velY < maxGrav) {
    player.velY += gravity;
  }

  player.x += player.velX;
  player.y += player.velY;

  for (let i = 0; i < portals.length; i++) {
    portals[i].x += portals[i].velX;
    portals[i].y += portals[i].velY;
  }


  ////////// Draw shapes

  canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

  // canvas.ctx.fillStyle = "red";
  // canvas.ctx.fillRect(player.x, player.y, player.width, player.height);

  canvas.ctx.drawImage(sprites.cubeSprite, player.x, player.y, player.width, player.height);


  player.grounded = false;

  //player + box collision
  for (let i = 0; i < map.boxesP.length; i++) {

    let sprite = sprites.boxSpriteP;

    if (mainBox === map.boxesP[i]) {
      sprite = sprites.boxSpriteBlue;
    } else if (altBox === map.boxesP[i]) {
      sprite = sprites.boxSpriteOrange;
    }

    canvas.ctx.drawImage(sprite, map.boxesP[i].x, map.boxesP[i].y, map.boxesP[i].width, map.boxesP[i].height);


    let dir = colCheck(player, map.boxesP[i]);

    // teleport player
    if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
      if (mainBox === map.boxesP[i] && Object.keys(altBox).length !== 0) {
          teleport(player, mainBox, altBox);
          continue;
      } else if (altBox === map.boxesP[i] && Object.keys(mainBox).length !== 0) {
          teleport(player, altBox, mainBox);
          continue;
      }
    }


    if (dir === "l" || dir === "r") {
      player.velX = 0;
    } else if (dir === "b") {
      player.grounded = true;
    } else if (dir === "t") {
      player.velY *= 0;
    }

  }

  //objectPlayerCol
  objectPlayerCol(canvas, player, map.boxesNP, sprites.boxSpriteNP);
  exitPlayerCol(canvas, player, map.exit, sprites.exitSprite);


  if (player.grounded) {
    player.velY = 0;
  }


  //draw portals
  for (let i = 0; i < portals.length; i++) {
    canvas.ctx.fillStyle = portals[i].color;

    canvas.ctx.beginPath();
    canvas.ctx.arc(portals[i].x, portals[i].y, portals[i].radius, 0, 2 * Math.PI);
    canvas.ctx.fill();
  }


  // Portal/wall collision detection
  let tempPortals = Object.assign([], portals);

  for (let i = 0; i < portals.length; i++) {
    for (let j = 0; j < map.boxesP.length; j++) {
      let dir = colCheck(portals[i], map.boxesP[j]);
      if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
        if (portals[i].color === mainPortalColor) {
          mainBox = map.boxesP[j];
          if (map.boxesP[j] === altBox) {
            altBox = {};
          }
          changeBoxDir(mainBox, dir);

        } else if (portals[i].color === altPortalColor) {
          altBox = map.boxesP[j];
          if (map.boxesP[j] === mainBox) {
            mainBox = {};
          }
          changeBoxDir(altBox, dir);

        }
        tempPortals.splice(i, 1);
      }
    }
  }
  portals = tempPortals;

  tempPortals = Object.assign([], portals);
  portals = objectPortalCol(map.boxesNP, tempPortals, portals);

  tempPortals = Object.assign([], portals);
  portals = objectPortalCol(map.exit, tempPortals, portals);


  // UPDATE every frame
  requestAnimationFrame(update);
}





document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

document.body.addEventListener("mousedown", function(e) {

  let color = mainPortalColor;

  if (e.button === 0) {
    keys['leftMouse'] = true;
    color = mainPortalColor;

  } else if (e.button === 2) {
    keys['rightMouse'] = true;
    color = altPortalColor;
  }

  let domRect = canvas.canvas.getBoundingClientRect();

  let dx = (e.x - player.x - domRect.x);
  let dy = (e.y - player.y - domRect.y);

  let mag = Math.sqrt(dx * dx + dy * dy);
  // debugger;

  let portal = {
    x: player.x,
    y: player.y,
    width: 10,
    height: 10,
    radius: 5,
    velX: (dx / mag) * portalSpeed,
    velY: (dy / mag) * portalSpeed,
    color: color
  };

  portals.push(portal);

});
document.body.addEventListener("mouseup", function(e) {
  if (e.button === 0) {
    keys['leftMouse'] = false;
  } else if (e.button === 2) {
    keys['rightMouse'] = false;
  }
});


// first update call
update();


});
