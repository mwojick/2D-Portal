
export const teleport = (player, box1, box2) => {
  switch (box2.dir) {
    case 'r':
      player.x = box2.x - player.width - 1;
      player.y = box2.y + box2.height/2;
      if (box1.dir === 'r'
          && player.velX > 0) {
        player.velX = -4*player.velX;
      }
      if ((box1.dir === 't' || box1.dir === 'b')
          && player.velY > 0) {
        let tempX = player.velX;
        player.velX = -4*player.velY;
        player.velY = tempX;
      }
      break;
    case 'l':
      player.x = box2.x + box2.width + 1;
      player.y = box2.y + box2.height/2;
      if (box1.dir === 'l'
          && player.velX < 0) {
        player.velX = -4*player.velX;
      }
      if ((box1.dir === 't' || box1.dir === 'b')
          && player.velY > 0) {
        let tempX = player.velX;
        player.velX = 4*player.velY;
        player.velY = tempX;
      }
      break;
    case 't':
      player.x = box2.x + box2.width/2;
      player.y = box2.y + box2.height;
      if ( (box1.dir === 'r' || box1.dir === 'l')
            && player.velY < 0) {
        player.velY = -player.velY;
      }
      break;
    case 'b':
      player.x = box2.x + box2.width/2;
      player.y = box2.y - player.height - 1;
      if ( (box1.dir === 'r' || box1.dir === 'l')
            && player.velY > 0) {
            player.velY = -player.velY;
      }
      if (box1.dir === 'b') {
        player.velY = -player.velY;
      }
      break;
  }
};
