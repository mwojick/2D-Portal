/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./entry.js":
/*!******************!*\
  !*** ./entry.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _test = __webpack_require__(/*! ./lib/test */ "./lib/test.js");

var _collision = __webpack_require__(/*! ./lib/collision */ "./lib/collision.js");

var _player = __webpack_require__(/*! ./lib/player */ "./lib/player.js");

var _teleport = __webpack_require__(/*! ./lib/teleport */ "./lib/teleport.js");

var _canvas = __webpack_require__(/*! ./lib/canvas */ "./lib/canvas.js");

var _map = __webpack_require__(/*! ./lib/maps/map */ "./lib/maps/map.js");

var _map_levels = __webpack_require__(/*! ./lib/maps/map_levels */ "./lib/maps/map_levels.js");

var _sprites = __webpack_require__(/*! ./lib/sprites */ "./lib/sprites.js");

document.addEventListener('DOMContentLoaded', function () {

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;

  var paused = false;
  var req = void 0;

  var canvas = new _canvas.Canvas("canvas"),
      keys = [],
      friction = 0.8,
      gravity = 0.8,
      maxGrav = 38,
      portalSpeed = 15;

  canvas.canvas.width = canvas.width;
  canvas.canvas.height = canvas.height;

  // Music
  var audio = new Audio('./music/Portal_Radio_Tune.mp3');
  audio.muted = true;

  //Get maps
  var maps = [_map_levels.map1, _map_levels.map2, _map_levels.map3, _map_levels.map4, _map_levels.map5, _map_levels.map6, _map_levels.map7, _map_levels.map8, _map_levels.map9, _map_levels.map10, _map_levels.map11, _map_levels.map12, _map_levels.map13];
  var map = new _map.Map(maps[0], 0);
  map.getMap();

  // Get sprites
  var sprites = new _sprites.Sprites();

  var mainBox = {};
  var altBox = {};

  var portals = [];
  var mainPortalColor = "blue";
  var altPortalColor = "orange";

  function update() {

    if (_player.player.levelCount !== map.level) {
      map = new _map.Map(maps[_player.player.levelCount], _player.player.levelCount);
      map.getMap();
      _player.player.x = _player.playerPos[_player.player.levelCount].x;
      _player.player.y = _player.playerPos[_player.player.levelCount].y;
      mainBox = {};
      altBox = {};
      document.querySelector(".level").innerText = _player.player.levelCount + 1;
      document.querySelector(".select-level").value = _player.player.levelCount + 1;
    }

    // check keys
    if (keys[38] || keys[32] || keys[87]) {
      // up arrow or space or w
      if (_player.player.grounded) {
        _player.player.grounded = false;
        _player.player.velY = -_player.player.speedY * _player.player.jumpMult;
      }
    }
    if (keys[39] || keys[68]) {
      // right arrow or d
      if (_player.player.velX < _player.player.speedX) {
        _player.player.velX += _player.player.velOffset;
      }
    }
    if (keys[37] || keys[65]) {
      // left arrow or a
      if (_player.player.velX > -_player.player.speedX) {
        _player.player.velX -= _player.player.velOffset;
      }
    }

    _player.player.velX *= friction;
    if (_player.player.velY < maxGrav) {
      _player.player.velY += gravity;
    }

    _player.player.x += _player.player.velX;
    _player.player.y += _player.player.velY;

    for (var i = 0; i < portals.length; i++) {
      portals[i].x += portals[i].velX;
      portals[i].y += portals[i].velY;
    }

    ////////// Draw shapes

    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // canvas.ctx.fillStyle = "red";
    // canvas.ctx.fillRect(player.x, player.y, player.width, player.height);

    canvas.ctx.drawImage(sprites.cubeSprite, _player.player.x, _player.player.y, _player.player.width, _player.player.height);

    _player.player.grounded = false;

    //player + box collision
    for (var _i = 0; _i < map.boxesP.length; _i++) {

      var sprite = sprites.boxSpriteP;

      if (mainBox === map.boxesP[_i]) {
        sprite = sprites.boxSpriteBlue;
      } else if (altBox === map.boxesP[_i]) {
        sprite = sprites.boxSpriteOrange;
      }

      canvas.ctx.drawImage(sprite, map.boxesP[_i].x, map.boxesP[_i].y, map.boxesP[_i].width, map.boxesP[_i].height);

      var dir = (0, _collision.colCheck)(_player.player, map.boxesP[_i]);

      // teleport player
      if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
        if (mainBox === map.boxesP[_i] && Object.keys(altBox).length !== 0) {
          (0, _teleport.teleport)(_player.player, mainBox, altBox);
          continue;
        } else if (altBox === map.boxesP[_i] && Object.keys(mainBox).length !== 0) {
          (0, _teleport.teleport)(_player.player, altBox, mainBox);
          continue;
        }
      }

      if (dir === "l" || dir === "r") {
        _player.player.velX = 0;
      } else if (dir === "b") {
        _player.player.grounded = true;
      } else if (dir === "t") {
        _player.player.velY *= 0;
      }
    }

    //objectPlayerCol
    (0, _collision.objectPlayerCol)(canvas, _player.player, map.boxesNP, sprites.boxSpriteNP);
    (0, _collision.objectPlayerCol)(canvas, _player.player, map.boxesT, sprites.boxSpriteT);
    (0, _collision.objectPlayerCol)(canvas, _player.player, map.cake, sprites.cakeSprite);
    (0, _collision.exitPlayerCol)(canvas, _player.player, map.exit, sprites.exitSprite);

    if (_player.player.grounded) {
      _player.player.velY = 0;
    }

    //draw portals
    for (var _i2 = 0; _i2 < portals.length; _i2++) {
      canvas.ctx.fillStyle = portals[_i2].color;

      canvas.ctx.beginPath();
      canvas.ctx.arc(portals[_i2].x, portals[_i2].y, portals[_i2].radius, 0, 2 * Math.PI);
      canvas.ctx.fill();
    }

    // Portal/wall collision detection
    var tempPortals = Object.assign([], portals);

    for (var _i3 = 0; _i3 < portals.length; _i3++) {
      for (var j = 0; j < map.boxesP.length; j++) {
        var _dir = (0, _collision.colCheck)(portals[_i3], map.boxesP[j]);
        if (_dir === "l" || _dir === "r" || _dir === "b" || _dir === "t") {
          if (portals[_i3].color === mainPortalColor) {
            mainBox = map.boxesP[j];
            if (map.boxesP[j] === altBox) {
              altBox = {};
            }
            (0, _collision.changeBoxDir)(mainBox, _dir);
          } else if (portals[_i3].color === altPortalColor) {
            altBox = map.boxesP[j];
            if (map.boxesP[j] === mainBox) {
              mainBox = {};
            }
            (0, _collision.changeBoxDir)(altBox, _dir);
          }
          tempPortals.splice(_i3, 1);
        }
      }
    }
    portals = tempPortals;

    tempPortals = Object.assign([], portals);
    portals = (0, _collision.objectPortalCol)(map.boxesNP, tempPortals, portals);

    tempPortals = Object.assign([], portals);
    portals = (0, _collision.objectPortalCol)(map.exit, tempPortals, portals);

    if (paused) {
      cancelAnimationFrame(req);
    } else {
      // UPDATE every frame
      req = requestAnimationFrame(update);
    }
  }

  document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
    // p
    if (e.keyCode === 80) {
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
      _player.player.x = _player.playerPos[map.level].x;
      _player.player.y = _player.playerPos[map.level].y;
    }
  });

  document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
  });

  document.body.addEventListener("mousedown", function (e) {

    var color = mainPortalColor;

    if (e.button === 0) {
      keys['leftMouse'] = true;
      color = mainPortalColor;
    } else if (e.button === 2) {
      keys['rightMouse'] = true;
      color = altPortalColor;
    }

    var domRect = canvas.canvas.getBoundingClientRect();

    var dx = e.x - _player.player.x - _player.player.width / 2 - domRect.x;
    var dy = e.y - _player.player.y - _player.player.height / 2 - domRect.y;

    var mag = Math.sqrt(dx * dx + dy * dy);

    var portal = {
      x: _player.player.x + _player.player.width / 2,
      y: _player.player.y + _player.player.height / 2,
      width: 15,
      height: 15,
      radius: 7,
      velX: dx / mag * portalSpeed,
      velY: dy / mag * portalSpeed,
      color: color
    };

    portals.push(portal);
  });
  document.body.addEventListener("mouseup", function (e) {
    if (e.button === 0) {
      keys['leftMouse'] = false;
    } else if (e.button === 2) {
      keys['rightMouse'] = false;
    }
  });

  document.querySelector(".select-level").addEventListener("change", function (e) {
    _player.player.levelCount = e.currentTarget.value - 1;
  });

  // first update call
  update();
});
// import { boxFunc } from './lib/boxes';

/***/ }),

/***/ "./lib/canvas.js":
/*!***********************!*\
  !*** ./lib/canvas.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WIDTH = exports.WIDTH = 1024;
var HEIGHT = exports.HEIGHT = 832;

var Canvas = exports.Canvas = function Canvas(canvasId) {
  _classCallCheck(this, Canvas);

  this.width = WIDTH;
  this.height = HEIGHT;
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
};

/***/ }),

/***/ "./lib/collision.js":
/*!**************************!*\
  !*** ./lib/collision.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colCheck = colCheck;
exports.changeBoxDir = changeBoxDir;
exports.objectPlayerCol = objectPlayerCol;
exports.exitPlayerCol = exitPlayerCol;
exports.objectPortalCol = objectPortalCol;


//collision check credit: http://www.somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/
function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  var vX = shapeA.x + shapeA.width / 2 - (shapeB.x + shapeB.width / 2),
      vY = shapeA.y + shapeA.height / 2 - (shapeB.y + shapeB.height / 2),

  // add the half widths and half heights of the objects
  hWidths = shapeA.width / 2 + shapeB.width / 2,
      hHeights = shapeA.height / 2 + shapeB.height / 2,
      colDir = null;

  // if the x and y vector are less than the half width or half height,
  //they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding
    //(top, bottom, left, or right)
    var oX = hWidths - Math.abs(vX);
    var oY = hHeights - Math.abs(vY);

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

function changeBoxDir(box, dir) {
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

function objectPlayerCol(canvas, player, mapBoxes, sprites) {
  for (var i = 0; i < mapBoxes.length; i++) {
    var sprite = sprites;

    canvas.ctx.drawImage(sprite, mapBoxes[i].x, mapBoxes[i].y, mapBoxes[i].width, mapBoxes[i].height);

    var dir = colCheck(player, mapBoxes[i]);

    if (dir === "l" || dir === "r") {
      player.velX = 0;
    } else if (dir === "b") {
      player.grounded = true;
    } else if (dir === "t") {
      player.velY *= 0;
    }
  }
}

function exitPlayerCol(canvas, player, mapBoxes, sprites) {
  for (var i = 0; i < mapBoxes.length; i++) {
    var sprite = sprites;

    canvas.ctx.drawImage(sprite, mapBoxes[i].x, mapBoxes[i].y, mapBoxes[i].width, mapBoxes[i].height);

    var dir = colCheck(player, mapBoxes[i]);

    // Go to next level
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

function objectPortalCol(mapBoxes, tempPortals, portals) {

  for (var i = 0; i < portals.length; i++) {
    for (var j = 0; j < mapBoxes.length; j++) {
      var dir = colCheck(portals[i], mapBoxes[j]);
      if (dir === "l" || dir === "r" || dir === "b" || dir === "t") {
        tempPortals.splice(i, 1);
      }
    }
  }
  return tempPortals;
}

//

/***/ }),

/***/ "./lib/maps/map.js":
/*!*************************!*\
  !*** ./lib/maps/map.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Map = exports.MAP_W = exports.MAP_H = exports.BLOCK_W = exports.BLOCK_H = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvas = __webpack_require__(/*! ../canvas */ "./lib/canvas.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BLOCK_H = exports.BLOCK_H = 64;
var BLOCK_W = exports.BLOCK_W = 64;

var MAP_H = exports.MAP_H = _canvas.HEIGHT / BLOCK_H;
var MAP_W = exports.MAP_W = _canvas.WIDTH / BLOCK_W;

var Map = exports.Map = function () {
  function Map(map, level) {
    _classCallCheck(this, Map);

    this.map = map;
    //portal-able boxes
    this.boxesP = [];
    //non-portal-able boxes
    this.boxesNP = [];
    //portal goes through these boxes
    this.boxesT = [];
    this.exit = [];
    this.cake = [];
    this.level = level;
  }

  _createClass(Map, [{
    key: 'getMap',
    value: function getMap() {
      var mapIndex = 0;

      for (var y = 0; y < MAP_H; y++) {
        for (var x = 0; x < MAP_W; x++, mapIndex++) {
          var tileX = x * BLOCK_W;
          var tileY = y * BLOCK_H;
          var tileType = this.map[mapIndex];

          var box = {
            x: tileX,
            y: tileY,
            width: BLOCK_W,
            height: BLOCK_H
          };

          if (tileType === 1) {
            this.boxesP.push(box);
          } else if (tileType === 2) {
            this.boxesNP.push(box);
          } else if (tileType === 3) {
            this.exit.push(box);
          } else if (tileType === 4) {
            this.boxesT.push(box);
          } else if (tileType === 5) {
            this.cake.push(box);
          }
        }
      }
    }
  }]);

  return Map;
}();

/***/ }),

/***/ "./lib/maps/map_levels.js":
/*!********************************!*\
  !*** ./lib/maps/map_levels.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

//width = 16, height = 13

var map1 = exports.map1 = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var map2 = exports.map2 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 1, 4, 4, 4, 4, 0, 0, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 4, 4, 4, 0, 0, 2, 2, 2, 2, 4, 4, 4, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var map3 = exports.map3 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2];

var map4 = exports.map4 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2];

var map5 = exports.map5 = [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

var map6 = exports.map6 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 4, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 2, 4, 4, 4, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1];

var map7 = exports.map7 = [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 4, 4, 4, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2];

var map8 = exports.map8 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 4, 0, 0, 0, 1, 2, 0, 4, 4, 4, 4, 2, 2, 0, 0, 0, 4, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 4, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2];

var map9 = exports.map9 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 4, 4, 4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 4, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 1, 1, 0, 0, 0, 4, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 1, 1, 0, 0, 0, 4, 0, 2, 0, 0, 0, 4, 0, 0, 0, 0, 2, 1, 0, 0, 0, 4, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0, 2, 1, 0, 0, 0, 4, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0, 2, 1, 0, 0, 0, 4, 0, 2, 0, 0, 0, 4, 0, 0, 0, 0, 2, 1, 0, 0, 0, 4, 0, 2, 0, 0, 0, 4, 0, 0, 0, 0, 2, 1, 1, 1, 1, 2, 1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2];

//uses pause buffering
var map10 = exports.map10 = [2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 0, 0, 4, 0, 1, 0, 0, 0, 0, 1, 0, 4, 0, 0, 2, 2, 0, 0, 4, 0, 1, 0, 0, 0, 0, 1, 0, 4, 0, 0, 2, 2, 0, 0, 4, 0, 1, 0, 0, 0, 0, 1, 0, 4, 0, 0, 2, 2, 0, 0, 4, 0, 1, 0, 0, 0, 0, 1, 0, 4, 0, 0, 2, 2, 0, 0, 4, 0, 1, 0, 0, 0, 0, 1, 0, 4, 0, 0, 2, 2, 0, 0, 4, 0, 1, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 2, 0, 0, 4, 0, 1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 4, 4, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 3, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2];

//uses reset
var map11 = exports.map11 = [4, 4, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 0, 4, 0, 0, 0, 0, 1, 0, 0, 4, 4, 0, 0, 0, 2, 4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 3, 2, 1, 0, 2, 0, 0, 0, 0, 4, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 4, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 2, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 2, 2, 2];

//uses out of level glitch
var map12 = exports.map12 = [0, 0, 4, 1, 1, 4, 4, 4, 4, 2, 1, 1, 1, 1, 1, 2, 2, 4, 4, 0, 1, 2, 2, 0, 4, 2, 0, 2, 1, 0, 0, 2, 2, 0, 4, 2, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 1, 4, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 1, 2, 0, 4, 0, 0, 4, 2, 2, 2, 2, 2, 0, 2, 0, 0, 1, 2, 4, 4, 4, 4, 2, 0, 2, 0, 0, 2, 1, 2, 0, 0, 1, 2, 2, 0, 2, 2, 2, 0, 2, 0, 0, 0, 2, 1, 0, 0, 2, 0, 4, 0, 0, 1, 2, 0, 2, 0, 0, 0, 2, 1, 0, 0, 2, 0, 4, 0, 2, 1, 1, 0, 2, 0, 2, 0, 2, 1, 0, 0, 2, 2, 0, 0, 2, 0, 4, 0, 2, 0, 2, 0, 2, 1, 0, 0, 2, 2, 0, 2, 1, 0, 0, 0, 2, 0, 2, 0, 2, 1, 0, 0, 1, 3, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 4, 4, 0, 0, 1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1];

//cake
var map13 = exports.map13 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

//skeleton
var map999 = exports.map999 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

/***/ }),

/***/ "./lib/player.js":
/*!***********************!*\
  !*** ./lib/player.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playerPos = exports.player = undefined;

var _canvas = __webpack_require__(/*! ./canvas */ "./lib/canvas.js");

var _map = __webpack_require__(/*! ./maps/map */ "./lib/maps/map.js");

var pDim = 42;

var player = exports.player = {
  x: _map.BLOCK_W,
  y: 5 * _map.BLOCK_H,
  width: pDim,
  height: pDim,
  speedY: 6,
  speedX: 8,
  jumpMult: 2,
  velX: 0,
  velY: 0,
  velOffset: 4,
  grounded: false,
  levelCount: 0
};

// Starting player positions for each level
var playerPos = exports.playerPos = [{ x: _map.BLOCK_W, y: 5 * _map.BLOCK_H }, { x: _map.BLOCK_W, y: 7 * _map.BLOCK_H }, { x: _map.BLOCK_W, y: 5 * _map.BLOCK_H }, { x: _map.BLOCK_W, y: 11 * _map.BLOCK_H }, { x: _map.BLOCK_W, y: 7 * _map.BLOCK_H }, { x: _map.BLOCK_W, y: 2 * _map.BLOCK_H }, { x: _map.BLOCK_W, y: 3 * _map.BLOCK_H }, { x: 3 * _map.BLOCK_W, y: _map.BLOCK_H }, { x: _map.BLOCK_W, y: _map.BLOCK_H }, { x: _map.BLOCK_W, y: 11 * _map.BLOCK_H }, { x: _map.BLOCK_W, y: 11 * _map.BLOCK_H }, { x: 8 * _map.BLOCK_W, y: 11 * _map.BLOCK_H },
// { x: 13*BLOCK_W, y: 11*BLOCK_H },
{ x: _map.BLOCK_W, y: 11 * _map.BLOCK_H }];

/***/ }),

/***/ "./lib/sprites.js":
/*!************************!*\
  !*** ./lib/sprites.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprites = exports.Sprites = function Sprites() {
  _classCallCheck(this, Sprites);

  this.boxSpriteP = new Image();
  this.boxSpriteP.src = "./sprites/wall_p.png";

  this.boxSpriteNP = new Image();
  this.boxSpriteNP.src = "./sprites/wall_np.png";

  this.boxSpriteT = new Image();
  this.boxSpriteT.src = "./sprites/wall_t.png";

  this.boxSpriteBlue = new Image();
  this.boxSpriteBlue.src = "./sprites/wall_blue.png";

  this.boxSpriteOrange = new Image();
  this.boxSpriteOrange.src = "./sprites/wall_orange.png";

  this.exitSprite = new Image();
  this.exitSprite.src = "./sprites/door.png";

  this.cubeSprite = new Image();
  this.cubeSprite.src = "./sprites/cube_clean.png";

  this.cakeSprite = new Image();
  this.cakeSprite.src = "./sprites/cake.png";
};

/***/ }),

/***/ "./lib/teleport.js":
/*!*************************!*\
  !*** ./lib/teleport.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var teleport = exports.teleport = function teleport(player, box1, box2) {
  switch (box2.dir) {
    case 'r':
      player.x = box2.x - player.width - 1;
      player.y = box2.y + box2.height / 2;
      if (box1.dir === 'r' && player.velX > 0) {
        player.velX = -4 * player.velX;
      }
      if ((box1.dir === 't' || box1.dir === 'b') && player.velY > 0) {
        var tempX = player.velX;
        player.velX = -4 * player.velY;
        player.velY = tempX;
      }
      break;
    case 'l':
      player.x = box2.x + box2.width + 1;
      player.y = box2.y + box2.height / 2;
      if (box1.dir === 'l' && player.velX < 0) {
        player.velX = -4 * player.velX;
      }
      if ((box1.dir === 't' || box1.dir === 'b') && player.velY > 0) {
        var _tempX = player.velX;
        player.velX = 4 * player.velY;
        player.velY = _tempX;
      }
      break;
    case 't':
      player.x = box2.x + box2.width / 2 - player.width / 2;
      player.y = box2.y + box2.height;
      if ((box1.dir === 'r' || box1.dir === 'l') && player.velY < 0) {
        player.velY = -player.velY;
      }
      break;
    case 'b':
      player.x = box2.x + box2.width / 2 - player.width / 2;
      player.y = box2.y - player.height - 1;
      if (box1.dir === 'r' && player.velY > 0) {
        player.velY = -player.velY - player.velX;
      }
      if (box1.dir === 'l' && player.velY > 0) {
        player.velY = -player.velY + player.velX;
      }
      if (box1.dir === 'b') {
        player.velY = -player.velY;
      }
      break;
  }
};

/***/ }),

/***/ "./lib/test.js":
/*!*********************!*\
  !*** ./lib/test.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Test = exports.Test = function Test() {
  console.log("test");
};

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map