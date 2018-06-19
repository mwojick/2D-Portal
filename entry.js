
import {Test} from './lib/test';
import {colCheck} from './lib/util';

document.addEventListener('DOMContentLoaded', () => {

  let requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;


let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 800,
    height = 600,
    pDim = 20,
    player = {
      x : width/2,
      y : height - 2* pDim,
      width : pDim,
      height : pDim,
      speed: 5,
      jumpMult: 2.5,
      velX: 0,
      velY: 0,
      velOffset: 3,
      jumping: false,
      grounded: false
    },
    keys = [],
    friction = 0.8,
    gravity = 0.6,
    maxGrav = 30;

canvas.width = width;
canvas.height = height;


// boxes
let boxes = [];

let mainBox = {};
let altBox = {};

// dimensions
boxes.push({
  x: 0,
  y: 0,
  width: 20,
  height: height
});
// boxes.push({
//   x: 15,
//   y: 15,
//   width: 15,
//   height: 15
// });
boxes.push({
  x: 0,
  y: height - 20,
  width: width,
  height: 20
});
boxes.push({
  x: 0,
  y: 0,
  width: width,
  height: 20
});
boxes.push({
  x: width - 20,
  y: 0,
  width: 20,
  height: height
});


boxes.push({
  x: 120,
  y: 30,
  width: 80,
  height: 60
});
boxes.push({
  x: 170,
  y: 50,
  width: 80,
  height: 80
});
boxes.push({
  x: 220,
  y: 100,
  width: 80,
  height: 70
});

boxes.push({
  x: 10,
  y: 400,
  width: 200,
  height: 30
});
boxes.push({
  x: 40,
  y: 470,
  width: 300,
  height: 30
});
boxes.push({
  x: 330,
  y: 430,
  width: 50,
  height: 80
});
boxes.push({
  x: 10,
  y: 530,
  width: 250,
  height: 30
});
boxes.push({
  x: 320,
  y: 400,
  width: 200,
  height: 30
});

boxes.push({
  x: 520,
  y: 300,
  width: 100,
  height: 40
});
boxes.push({
  x: 320,
  y: 200,
  width: 100,
  height: 40
});
boxes.push({
  x: 620,
  y: 400,
  width: 200,
  height: 200
});
boxes.push({
  x: 520,
  y: 500,
  width: 80,
  height: 80
});



let portals = [];
let mainPortalColor = "blue";
let altPortalColor = "orange";

function update(){

  // check keys
  if (keys[38] || keys[32] || keys[87]) {
      // up arrow or space or w
    if(player.grounded){
     player.jumping = true;
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



  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);


  player.grounded = false;

  //player + box collision
  for (let i = 0; i < boxes.length; i++) {

    let color = "black";

    if (mainBox === boxes[i]) {
      color = mainPortalColor;
    } else if (altBox === boxes[i]) {
      color = altPortalColor;
    }

    ctx.fillStyle = color;
    ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

    let dir = colCheck(player, boxes[i]);

    if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
      if (mainBox === boxes[i] && Object.keys(altBox).length !== 0) {
        switch (altBox.dir) {
          case 'r':
            player.x = altBox.x - player.width - 1;
            player.y = altBox.y + altBox.height/2;
            if ((mainBox.dir === 't' || mainBox.dir === 'b')
                && player.velX > 0) {
              player.velX = -4*player.velX;
            }
            break;
          case 'l':
            player.x = altBox.x + altBox.width + 1;
            player.y = altBox.y + altBox.height/2;
            if ((mainBox.dir === 't' || mainBox.dir === 'b')
                && player.velX < 0) {
              player.velX = -4*player.velX;
            }
            break;
          case 't':
            player.x = altBox.x + altBox.width/2;
            player.y = altBox.y + altBox.height;
            if (mainBox.dir === 'r' || mainBox.dir === 'l' ) {
              player.velY = -player.velY;
            }
            break;
          case 'b':
            player.x = altBox.x + altBox.width/2;
            player.y = altBox.y - player.height - 1;
            player.velY = -player.velY;
            break;
        }
        continue;
      } else if (altBox === boxes[i] && Object.keys(mainBox).length !== 0) {
        switch (mainBox.dir) {
          case 'r':
            player.x = mainBox.x - player.width - 1;
            player.y = mainBox.y + mainBox.height/2;
            if ((altBox.dir === 't' || altBox.dir === 'b')
                && player.velX > 0) {
              player.velX = -4*player.velX;
            }
            break;
          case 'l':
            player.x = mainBox.x + mainBox.width + 1;
            player.y = mainBox.y + mainBox.height/2;
            if ((altBox.dir === 't' || altBox.dir === 'b')
                && player.velX < 0) {
              player.velX = -4*player.velX;
            }
            break;
          case 't':
            player.x = mainBox.x + mainBox.width/2;
            player.y = mainBox.y + mainBox.height;
            if (altBox.dir === 'r' || altBox.dir === 'l' ) {
              player.velY = -player.velY;
            }
            break;
          case 'b':
            player.x = mainBox.x + mainBox.width/2;
            player.y = mainBox.y - player.height - 1;
            player.velY = -player.velY;
            break;
        }
        continue;
      }
    }


    if (dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping = false;
    } else if (dir === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if (dir === "t") {
      player.velY *= 0;
    }
  }

  if (player.grounded) {
    player.velY = 0;
  }




  for (let i = 0; i < portals.length; i++) {
    ctx.fillStyle = portals[i].color;

    ctx.beginPath();
    ctx.arc(portals[i].x, portals[i].y, portals[i].radius, 0, 2 * Math.PI);
    ctx.fill();
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
          switch (dir) {
            case 'l':
              mainBox.dir = 'l';
              break;
            case 'r':
              mainBox.dir = 'r';
              break;
            case 'b':
              mainBox.dir = 'b';
              break;
            case 't':
              mainBox.dir = 't';
              break;
          }
        } else if (portals[i].color === altPortalColor) {
          altBox = boxes[j];
          if (boxes[j] === mainBox) {
            mainBox = {};
          }
          switch (dir) {
            case 'l':
              altBox.dir = 'l';
              break;
            case 'r':
              altBox.dir = 'r';
              break;
            case 'b':
              altBox.dir = 'b';
              break;
            case 't':
              altBox.dir = 't';
              break;
          }
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
    // console.log(e.keyCode);
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

  let dx = (e.x - player.x);
  let dy = (e.y - player.y);

  let mag = Math.sqrt(dx * dx + dy * dy);

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
