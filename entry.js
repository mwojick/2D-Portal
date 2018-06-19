
import { Test } from './lib/test';
import { colCheck, changeBoxDir } from './lib/collision';
import { player } from './lib/player';
import { boxFunc } from './lib/boxes';
import { teleport } from './lib/teleport';
import { Canvas } from './lib/canvas';

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
    gravity = 0.6,
    maxGrav = 30;

canvas.canvas.width = canvas.width;
canvas.canvas.height = canvas.height;


let boxes = boxFunc();

let mainBox = {};
let altBox = {};



let portals = [];
let mainPortalColor = "blue";
let altPortalColor = "orange";

function update(){

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

  canvas.ctx.fillStyle = "red";
  canvas.ctx.fillRect(player.x, player.y, player.width, player.height);


  player.grounded = false;

  //player + box collision
  for (let i = 0; i < boxes.length; i++) {

    let color = "black";

    if (mainBox === boxes[i]) {
      color = mainPortalColor;
    } else if (altBox === boxes[i]) {
      color = altPortalColor;
    }

    canvas.ctx.fillStyle = color;
    canvas.ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

    let dir = colCheck(player, boxes[i]);

    if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
      if (mainBox === boxes[i] && Object.keys(altBox).length !== 0) {
          teleport(player, mainBox, altBox);
          continue;
      } else if (altBox === boxes[i] && Object.keys(mainBox).length !== 0) {
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

  if (player.grounded) {
    player.velY = 0;
  }




  for (let i = 0; i < portals.length; i++) {
    canvas.ctx.fillStyle = portals[i].color;

    canvas.ctx.beginPath();
    canvas.ctx.arc(portals[i].x, portals[i].y, portals[i].radius, 0, 2 * Math.PI);
    canvas.ctx.fill();
  }


  // Portal/wall collision detection
  let tempPortals = Object.assign([], portals);

  for (let i = 0; i < portals.length; i++) {
    for (let j = 0; j < boxes.length; j++) {
      let dir = colCheck(portals[i], boxes[j]);
      if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
        if (portals[i].color === mainPortalColor) {
          mainBox = boxes[j];
          if (boxes[j] === altBox) {
            altBox = {};
          }
          changeBoxDir(mainBox, dir);

        } else if (portals[i].color === altPortalColor) {
          altBox = boxes[j];
          if (boxes[j] === mainBox) {
            mainBox = {};
          }
          changeBoxDir(altBox, dir);

        }
        tempPortals.splice(i, 1);
      }
    }
  }
  portals = tempPortals;




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
    velX: (dx / mag) * 10,
    velY: (dy / mag) * 10,
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



update();


});
