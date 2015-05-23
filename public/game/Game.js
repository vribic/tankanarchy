/**
 * Class containing the game, handles drawing and updates.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Game(canvas, socket) {
  this.canvas_ = canvas;
  this.canvas_.width = Game.WIDTH;
  this.canvas_.height = Game.HEIGHT;
  this.canvasContext_ = this.canvas_.getContext('2d');

  this.socket_ = socket;

  this.id_ = null;
  this.lastShotTime_ = null;
  this.players_ = [];
};

Game.WIDTH = 800;
Game.HEIGHT = 600;

Game.prototype.getCanvas = function() {
  return this.canvas_;
};

Game.prototype.getContext = function() {
  return this.canvasContext_;
};

Game.prototype.getID = function() {
  return this.id_;
};

Game.prototype.getPlayers = function() {
  return this.players_;
};

Game.prototype.setID = function(id) {
  this.id_ = id;
};

Game.prototype.update = function() {
  if (Input.UP || Input.RIGHT ||
      Input.DOWN || Input.LEFT) {
    this.socket_.emit('move-player', {
      id: this.id_,
      keyboardState: {
        up: Input.UP,
        right: Input.RIGHT,
        down: Input.DOWN,
        left: Input.LEFT
      }
    });
  }

  if (Input.CLICK) {
    var self = this.findSelf();
    this.socket_.emit('fire-bullet', {
      firedBy: this.id_
    });
  }
};

Game.prototype.findSelf = function() {
  for (var i = 0; i < this.players_.length; ++i) {
    if (this.players_[i].id_ == this.id_) {
      return this.players_[i];
    }
  }
  return null;
};

Game.prototype.receivePlayers = function(players) {
  this.players_ = players;
};

Game.prototype.draw = function() {
  this.canvasContext_.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
  for (var i = 0; i < this.players_.length; ++i) {
    if (this.players_[i].id_ == this.id_) {
      Drawing.drawSelf(this, this.canvasContext_, this.players_[i]);
    } else {
      Drawing.drawOther(this, this.canvasContext_, this.players_[i]);
    }
  }
};
