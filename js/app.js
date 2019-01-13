// Arrays with starting positions and movement speeds so they can be randomly chosen later on
const startingPositions = [-100, -225, -350, -475, -600, -725, -850];
const movementSpeeds = [150, 200, 250, 300, 350, 400, 450];

// Sound class to play different sounds
class Sound {
  constructor(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  }

  // Prototype method
  play() {
    this.sound.play();
  }
}

// Enemies our player must avoid
class Enemy {
  constructor(x, y, movement) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // The sprite's starting coordinates
    this.x = x;
    this.y = y;
    // The sprite's movement speed
    this.movement = movement;
    // The enemy's front for determining collision
    this.enemyFront = this.x + 65;
    this.enemyBack = this.x - 50;
  }

  // Prototype methods

  // Update the enemy's position
  // Parameter: dt, a time delta between ticks
  update(dt) {
    if (this.x > 505) {
      const randomStartingPosition = pickRandomFrom(startingPositions);
      this.x = randomStartingPosition;
      const randomMovement = pickRandomFrom(movementSpeeds);
      this.movement = randomMovement;
    }
    this.enemyFront = this.x + 65;
    this.enemyBack = this.x - 50;
    const maxY = player.y + 50;
    if (this.enemyFront > player.x && this.enemyBack < player.x && this.y > player.y && this.y < maxY) {
      hitSound.play();
      reset();
    }
    // Multiply movement by dt parameter, which insures same movement speed across different computers
    const currentMovement = this.movement * dt;
    this.x = this.x + currentMovement;
  };

  // Draw the enemy on the screen,
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
};

// Our player
class Player {
  constructor(x, y) {
    this.sprite = 'images/char-cat-girl.png';
    this.x = x;
    this.y = y;
  }

  // Prototype methods
  update(changeY, changeX) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.y += changeY;
    this.x += changeX;
    if (this.y === -45 && this.x === 303) {
      // Remove event listener to prevent player movement when modal is shown
      document.removeEventListener('keyup', keyEvents);

      ctx.clearRect(0, 0, ctx.width, ctx.height);

      // Play winning sound
      wonSound.play();
      this.y = -45.1;
      // Invoke modal constructor
      modal.open();
    }
  };

  // Draw the player on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  handleInput(key) {
    stepSound.play();
    let changeY = 0;
    let changeX = 0;
    // Check if user is not already on edge tile, if so, do not let him move
    switch (key) {
      case 'up':
        if (this.y === -45 || this.y === -45.1) {
          changeY = 0;
        } else {
          changeY = -84;
        }
        break;
      case 'down':
        if (this.y === 375) {
          changeY = 0;
        } else {
          changeY = 84;
        }
        break;
      case 'left':
        if (this.x === 0) {
          changeX = 0;
        } else {
          changeX = -101;
        }
        break;
      case 'right':
        if (this.x === 404) {
          changeX = 0;
        } else {
          changeX = 101;
        }
        break;
    }
    player.update(changeY, changeX);
  };
}

// Our boat
class Boat {
  constructor(x, y) {
    this.sprite = 'images/boat-without-mast-small.png';
    this.x = x;
    this.y = y;
  }

  // Prototype method
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
}

// Modified this example from a later class which refers to https://lowrey.me/modals-in-pure-es6-javascript/
class Modal {
  constructor(overlay) {
    this.overlay = overlay;
    // Allow user to reset the game from the modal
    const resetButtonModal = overlay.querySelector('#reset-button-modal');
    resetButtonModal.addEventListener('click', reset)
    const levellingButtonModal = overlay.querySelector('#levelling-button-modal');
    levellingButtonModal.addEventListener('click', keepLevelling)
  }
  open() {
    this.overlay.classList.remove('is-hidden');
  }

  close() {
    this.overlay.classList.add('is-hidden');
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let boat = {};
let allEnemies = [];
let player = {};
let stepSound;
let wonSound;
let hitSound;
let level = 1;
function instantiateGame(level) {
  // Start listening for key events
  document.addEventListener('keyup', keyEvents);
  // Only instantiate the sounds if they have do not exist yet, to prevent pollution of html
  if (stepSound === undefined) {
    stepSound = new Sound("./music/Blip 1.wav");
  }
  if (wonSound === undefined) {
    wonSound = new Sound("./music/power_up_04.ogg");
  }
  if (hitSound === undefined) {
    hitSound = new Sound("./music/retro_die_03.ogg");
  }

  if (level <= 5) {
    allEnemies = [
      new Enemy(pickRandomFrom(startingPositions), 62, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 62, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 146, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 146, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 230, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 230, pickRandomFrom(movementSpeeds))
    ];
  } else if (level > 5 && level <= 10) {
    allEnemies = [
      new Enemy(pickRandomFrom(startingPositions), 62, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 62, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 146, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 146, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 146, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 230, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 230, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 230, pickRandomFrom(movementSpeeds))
    ];
  } else {
    allEnemies = [
      new Enemy(pickRandomFrom(startingPositions), 62, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 62, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 62, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 146, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 146, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 146, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 230, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 230, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 230, pickRandomFrom(movementSpeeds)),
      new Enemy(pickRandomFrom(startingPositions), 230, pickRandomFrom(movementSpeeds))
    ];
  }
  boat = new Boat(275, -15);
  player = new Player(101, 375);
}

const modal = new Modal(document.querySelector('.modal-overlay'));

// Randomly generate both the startingPositions as well as the movement speed for the enemies, to prevent the game from being predictable
function pickRandomFrom(arrayToChooseFrom) {
  const randomItemInArray = arrayToChooseFrom[Math.floor(Math.random()*arrayToChooseFrom.length)];
  return randomItemInArray;
}

// Resetting the game is simply reinstantiating the instances of the classes
function reset() {
  modal.close();
  allEnemies = [];
  player = {};
  resetLevel();
  instantiateGame(level);
}

// Keep levelling is like resetting but updating the level
function keepLevelling() {
  modal.close();
  allEnemies = [];
  player = {};
  updateLevel();
  instantiateGame(level);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
function keyEvents(e) {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
}

function resetLevel() {
  const levelElement = document.getElementById('level-counter');
  level = 1;
  levelElement.innerHTML = level;
}

function updateLevel() {
  const levelElement = document.getElementById('level-counter');
  level++;
  levelElement.innerHTML = level;
}
