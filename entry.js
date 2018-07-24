
import { disableScrollBars } from './lib/util';

import { colCheck, changeBoxDir,
  objectPlayerCol, objectPortalCol,
  exitPlayerCol
} from './lib/collision';

import { player, playerPos } from './lib/player';

import { teleport } from './lib/teleport';
import { Canvas } from './lib/canvas';
import { Map, BLOCK_W, BLOCK_H } from './lib/maps/map';

import { map1, map2, map3,  map4, map5,
      map6, map7, map8, map9, map10,
      map11, map12, map13
    } from './lib/maps/map_levels';

import { Sprites } from './lib/sprites';


document.addEventListener('DOMContentLoaded', () => {

  // disableScrollBars();

  let requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;

  let paused = false;
  let req;

let canvas = new Canvas("canvas"),
    keys = [],
    friction = 0.8,
    gravity = 0.8,
    maxGrav = 38,
    portalSpeed = 15;

canvas.canvas.width = canvas.width;
canvas.canvas.height = canvas.height;

// Modal logic (https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal)

// Get the modal
var modal = document.getElementsByClassName('modal')[0];

// Get the button that opens the modal
var btn = document.getElementsByClassName("description-button")[0];

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
};
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
};

// Music
let audio = new Audio('./music/Portal_Radio_Tune.mp3');
audio.muted = true;


//Get maps
let maps = [map1, map2, map3, map4, map5,
            map6, map7, map8, map9, map10, map11, map12, map13];
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
    mainBox = {};
    altBox = {};
    document.querySelector(".level").innerText = player.levelCount + 1;
    document.querySelector(".select-level").value = player.levelCount + 1;
  }

  // check keys
  if (keys[38] || keys[32] || keys[87]) {
      // up arrow or space or w
    if(player.grounded){
     player.grounded = false;
     player.velY = -player.speedY*player.jumpMult;
    }
  }
  if (keys[39] || keys[68]) {
      // right arrow or d
      if (player.velX < player.speedX) {
          player.velX += player.velOffset;
       }
  }
  if (keys[37] || keys[65]) {
      // left arrow or a
      if (player.velX > -player.speedX) {
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
      switch (mainBox.dir) {
        case "b":
          sprite = sprites.boxSpriteBlueT;
          break;
        case "t":
          sprite = sprites.boxSpriteBlueB;
          break;
        case "r":
          sprite = sprites.boxSpriteBlueL;
          break;
        case "l":
          sprite = sprites.boxSpriteBlueR;
          break;
        default:
          sprite = sprites.boxSpriteBlue;
      }
    } else if (altBox === map.boxesP[i]) {
      switch (altBox.dir) {
        case "b":
          sprite = sprites.boxSpriteOrangeT;
          break;
        case "t":
          sprite = sprites.boxSpriteOrangeB;
          break;
        case "r":
          sprite = sprites.boxSpriteOrangeL;
          break;
        case "l":
          sprite = sprites.boxSpriteOrangeR;
          break;
        default:
          sprite = sprites.boxSpriteOrange;
      }
    }

    canvas.ctx.drawImage(sprite, map.boxesP[i].x, map.boxesP[i].y, map.boxesP[i].width, map.boxesP[i].height);


    let dir = colCheck(player, map.boxesP[i]);

    // teleport player
    if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
      if (mainBox === map.boxesP[i] && Object.keys(altBox).length !== 0 && mainBox.dir === dir) {
          teleport(player, mainBox, altBox);
          continue;
      } else if (altBox === map.boxesP[i] && Object.keys(mainBox).length !== 0 && altBox.dir === dir) {
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
  objectPlayerCol(canvas, player, map.boxesT, sprites.boxSpriteT);
  objectPlayerCol(canvas, player, map.cake, sprites.cakeSprite);
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

  if (paused) {
    cancelAnimationFrame(req);
  } else {
    // UPDATE every frame
    req = requestAnimationFrame(update);
  }

}



document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    // p
    if(e.keyCode === 80){
      paused = !paused;
      update();
    }
    // m
    if (e.keyCode === 77) {
      audio.play();
      audio.muted = !audio.muted;
    }
    // r
    if (e.keyCode === 82) {
      player.x = playerPos[map.level].x;
      player.y = playerPos[map.level].y;
    }
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

  let dx = (e.x - player.x - player.width/2 - domRect.x);
  let dy = (e.y - player.y - player.height/2 - domRect.y);

  let mag = Math.sqrt(dx * dx + dy * dy);

  let portal = {
    x: player.x + player.width/2,
    y: player.y + player.height/2,
    width: 15,
    height: 15,
    radius: 7,
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


document.querySelector(".select-level").addEventListener("change", function(e) {
  player.levelCount = e.currentTarget.value - 1;

});




// first update call
update();


});
