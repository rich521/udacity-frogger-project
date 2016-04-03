//Define all our necessary global variables here in order
"use strict";
var allEnemies = [], // Put all our our enemyBugs in an array
    player, // Define the player
    checkPlayerX, //for collision detection
    checkPlayerY,
    gameState = true, //run the game while true
    placeStar = 2, //changable x-position for 'starPos'
    leaveRock = 2, //same rock pos as where star lies
    score = 0, //score is set to 0 
    CHARBOY = ['images/char-boy.png', 'images/char-boy-star.png'], //switch picture when collected star
    YPOS = [0.73, 1.73, 2.73], // Defining the enemyBugs adjusted y-position on the three rows
    enemyBug, //define the enemyBug
    playerPos = [2, 0], //Indicate the starting player's grid position
    starPos = [placeStar, 5],
    TILE_WIDTH = 101,
    TILE_HEIGHT = 83; //defining the actual star's grid position

// Enemies our player must avoid
var Enemy = function(sprite, x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
    this.sp = Math.random() * 300 + 80; //speed, with minimum 80
    this.x = x * TILE_WIDTH; //101 and 83 adjusting for y position
    this.y = y * TILE_HEIGHT;
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (gameState) {
        this.x += this.sp * dt;
        //When each bug moves, check if we have collided with player
        this.checkCollisions();
        //If enemyBug goes off screen, we instantly move it back to the left.
        //we assign a new speed
        if (this.x > 520) {
            this.x = -120;
            this.sp = Math.random() * 200 + 90;
        }
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Create the enemy with initial parameters and store it into array
function createBug(sprite, x, y) {
    enemyBug = new Enemy(sprite, x, YPOS[y]);
    // Store each enemy into array
    allEnemies.push(enemyBug);
}
// Create our initial starting 6 enemies. Call the createBug function
for (var i = 0; i < 3; i++) {
    //parameters: randSp, x, y
    var imageStr = 'images/enemy-bug.png';
    // Create 2 x 3 (6) enemies on the screen
    createBug(imageStr, Math.floor(Math.random() * 4) + 1, i);
    // Outside of screen
    createBug(imageStr, -1, i);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sprite, x, y) {
    Enemy.call(this, sprite, x, y);
};

//player shares the x, y, sprite, render properties
Player.prototype = Object.create(Enemy.prototype);
Player.prototype.update = function(dt) {
    //'CheckPlayersXY' --> Storing the x,y position for collision dection
    checkPlayerX = this.x;
    checkPlayerY = this.y;
};
//Parameters adjusted for better posistioning
var newPlayer = new Player(CHARBOY[0], 2, 4.9);
player = newPlayer;
//Object method for checking collision
Enemy.prototype.checkCollisions = function () {
    //numbers adjusted for image edges
    if (this.x > player.x - 60 && this.x < player.x + 40 && this.y > player.y - 50 && this.y < player.y + 50) {
        gameState = false;
    }
};
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

//Handles user keyboard input
Player.prototype.handleInput = function(allowedKeys) {
    if (gameState) {
        switch (allowedKeys) {
            case ('left'):
                if (this.x > 0) {
                    this.x -= TILE_WIDTH; //Move left 101px               
                    playerPos[0] -= 1;
                }
                break;
            case ('up'):
                if (this.y > 0) {
                    this.y -= TILE_HEIGHT;
                    playerPos[1] += 1;
                }
                break;
            case ('right'):
                if (this.x < 404) {
                    this.x += TILE_WIDTH;
                    playerPos[0] += 1;
                }
                break;
            case ('down'):
                if (this.y < 406) {
                    this.y += TILE_HEIGHT;
                    playerPos[1] -= 1;
                }
                break;
        }
        //check for collision with star and player when player moves to another grid
        if (playerPos[0] === starPos[0] && playerPos[1] === starPos[1]) {
            placeStar = 0; //Remove the star
            this.sprite = CHARBOY[1];
        } else if (playerPos[1] < 2 && placeStar === 0) {
            placeStar = Math.floor(Math.random() * 4) + 1; //Randomize the star position
            leaveRock = placeStar; //Change the rock pos on water after star has been removed
            starPos[0] = placeStar; //Recorrect the star x-position
            this.sprite = CHARBOY[0]; //Reset the player image to default
            score++; //+ 1 point for star for returning it
        //If you go on water without the star, gameover.
        } else if(playerPos[1] === 5 && playerPos[0] !== starPos[0]){
            gameState = false;
        }

    } else {
        if (allowedKeys === 'enter' || allowedKeys === 'space') {
            this.x = 202;
            this.y = 406.7;
            this.sprite = CHARBOY[0]; //Remove the star from player
            //Wait a few ms to reset. Fixes bug collision when resetting
            setTimeout(function() {
                resetVar();
            }, 50);
        }
    }
};
//Reset Variables
function resetVar() {
    gameState = true; // Continue the game again
    playerPos = [2, 0]; //Reset the player position
    placeStar = 2; //Place the star back to middle
    starPos[0] = placeStar; //x-pos of star
    score = 0; //Reset the score
    leaveRock = 2; //Reset the rock pos to default
}
//Prevent scrolling on spacebar press
window.onkeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        return false;
    }
};