
export function colCheck(shapeA, shapeB) {
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



export function changeBoxDir(box, dir) {
  switch (dir) {
    case 'l':
      box.dir = 'l';
      break;
    case 'r':
      box.dir = 'r';
      break;
    case 'b':
      box.dir = 'b';
      break;
    case 't':
      box.dir = 't';
      break;
  }
}


export function objectPlayerCol(canvas, player, mapBoxes, sprites) {
  for (let i = 0; i < mapBoxes.length; i++) {
    let sprite = sprites;

    canvas.ctx.drawImage(sprite, mapBoxes[i].x, mapBoxes[i].y, mapBoxes[i].width, mapBoxes[i].height);

    let dir = colCheck(player, mapBoxes[i]);

    if (dir === "l" || dir === "r") {
      player.velX = 0;
    } else if (dir === "b") {
      player.grounded = true;
    } else if (dir === "t") {
      player.velY *= 0;
    }
  }
}

export function exitPlayerCol(canvas, player, mapBoxes, sprites) {
  for (let i = 0; i < mapBoxes.length; i++) {
    let sprite = sprites;

    canvas.ctx.drawImage(sprite, mapBoxes[i].x, mapBoxes[i].y, mapBoxes[i].width, mapBoxes[i].height);

    let dir = colCheck(player, mapBoxes[i]);

    if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
      player.levelCount++;
    }

    if (dir === "l" || dir === "r") {
      player.velX = 0;
    } else if (dir === "b") {
      player.grounded = true;
    } else if (dir === "t") {
      player.velY *= 0;
    }
  }
}


export function objectPortalCol(mapBoxes, tempPortals, portals) {

  for (let i = 0; i < portals.length; i++) {
    for (let j = 0; j < mapBoxes.length; j++) {
      let dir = colCheck(portals[i], mapBoxes[j]);
      if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
        tempPortals.splice(i, 1);
      }
    }
  }
  return tempPortals;
}


//
