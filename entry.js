
import {Test} from './lib/test';

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
    pDim = 15,
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
    gravity = 0.6;

canvas.width = width;
canvas.height = height;


// boxes
let boxes = [];

// dimensions
boxes.push({
  x: 0,
  y: 0,
  width: 10,
  height: height
});
boxes.push({
  x: 0,
  y: height - 5,
  width: width,
  height: 50
});
boxes.push({
  x: 0,
  y: 0,
  width: width,
  height: 10
});
boxes.push({
  x: width - 10,
  y: 0,
  width: 50,
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


function update(){

  // check keys
  if (keys[38] || keys[32]) {
      // up arrow or space
    if(!player.jumping && player.grounded){
     player.jumping = true;
     player.grounded = false;
     player.velY = -player.speed*player.jumpMult;
    }
  }
  if (keys[39]) {
      // right arrow
      if (player.velX < player.speed) {
          player.velX += player.velOffset;
       }
  }
  if (keys[37]) {
      // left arrow
      if (player.velX > -player.speed) {
          player.velX -= player.velOffset;
      }
  }

  player.velX *= friction;
  player.velY += gravity;

  player.x += player.velX;
  player.y += player.velY;

  for (let i = 0; i < portals.length; i++) {
    portals[i].x += portals[i].velX;
    portals[i].y += portals[i].velY;
  }





  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "black";
  ctx.beginPath();

  player.grounded = false;
  for (let i = 0; i < boxes.length; i++) {
    ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

    let dir = colCheck(player, boxes[i]);

    if (dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping = false;
    } else if (dir === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if (dir === "t") {
      player.velY *= -1;
    }
  }

  if (player.grounded) {
    player.velY = 0;
  }

  ctx.fill();

  for (let i = 0; i < portals.length; i++) {
    ctx.fillStyle = portals[i].color;
    ctx.fillRect(portals[i].x, portals[i].y,
      portals[i].width, portals[i].height);
  }





  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    let vX = (shapeA.x + (shapeA.width / 2)) -
                (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) -
                (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height,
    //they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding
      //(top, bottom, left, or right)
      let oX = hWidths - Math.abs(vX);
      let oY = hHeights - Math.abs(vY);

      if (oX >= oY) {
        if (vY > 0) {
          colDir = "t";
          shapeA.y += oY;
        } else {
          colDir = "b";
          shapeA.y -= oY;
        }
      } else {
        if (vX > 0) {
          colDir = "l";
          shapeA.x += oX;
        } else {
          colDir = "r";
          shapeA.x -= oX;
        }
      }
    }
    return colDir;
}

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    // console.log(e.keyCode);
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

document.body.addEventListener("mousedown", function(e) {

  let color = "blue";

  if (e.button === 0) {
    keys['leftMouse'] = true;
    color = "blue";

    // console.log(e.x);
    // console.log(e.y);

    // console.log('left down');
  } else if (e.button === 2) {
    keys['rightMouse'] = true;
    color = "orange";
    // console.log('right down');
  }

  let dx = (e.x - player.x);
  let dy = (e.y - player.y);
  console.log("dx: ", dx);
  console.log("dy: ",dy);
  let mag = Math.sqrt(dx * dx + dy * dy);

  let portal = {
    x: player.x,
    y: player.y,
    velX: (dx / mag) * 10,
    velY: (dy / mag) * 10,
    width: 8,
    height: 8,
    color: color
  };

  portals.push(portal);

});
document.body.addEventListener("mouseup", function(e) {
  if (e.button === 0) {
    keys['leftMouse'] = false;

    // console.log('left up');
  } else if (e.button === 2) {
    keys['rightMouse'] = false;

    // console.log('right up');
  }
});




// $("#myId").mousedown(function(ev){
//       if(ev.which == 3)
//       {
//             alert("Right mouse button clicked on element with id myId");
//       }
// });


update();


});
