;(function() {
  'use strict';

  // Global access
  window.ParticleVisual = window.ParticleVisual || {};

  // CONSTANTS lol not really
  var DEBUG = true,
      SHOW_CONSOLE_FPS = false,
      VISUAL_SPEED_MULT = 5, // 'master' speed var
      VISUAL_RESPEED_STEP = 0.5,
      VISUAL_HUES = [
        45,
        151,
        166,
        195,
        203,
        223,
        290,
        325,
        347,
        355,
      ],
      VISUAL_HUE = VISUAL_HUES[Math.ceil(Math.random() * VISUAL_HUES.length) - 1],
      VISUAL_SATURATION = 48,
      VISUAL_LIGHTING = 80,
      PARTICLE_DRAGS = true, // canvas doesn't clear
      PARTICLE_DRAG_MOD = 1,
      PARTICLE_AMOUNT = 50,
      PARTICLE_MAX_SIZE = 8, // px
      PARTICLE_MIN_SIZE = 2,
      PARTICLE_JITTER_RATE,
      PARTICLE_BLINK_RATE,
      KEYS = {
        LEFT: 37,
        RIGHT: 39,
        I: 73,
        O: 79,
        UP: 38,
        DOWN: 40,
        SPACE: 32,
        M: 77
      };

  ParticleVisual.frames = function(amount) {
    if (typeof amount === 'number') {
      frameCount = amount;
    }
    return frameCount;
  };
  ParticleVisual.count = function() {
    return particleAmount;
  };
  var skip = false, // switch bool for skipping every second frame
      frameCount = 0,
      particleAmount = PARTICLE_AMOUNT

  /**
   * A single visualisation instance, handling updating and
   * drawing of visual content.
   */
  var Visual = function(canvasContext, width, height) {
    var screen = canvasContext;

    var self = this;
    this.stopped = false;
    self.size = {
      x: width,
      y: height
    };
    if (DEBUG) {
      console.log('~~~~');
      console.log('Particle Visualisation started.');
      console.log('  Particles: ' + PARTICLE_AMOUNT + '.');
      console.log('  Size:      ' + self.size.x + 'px * ' + self.size.y + 'px.');
      console.log('~~~~');
    }
    self.particles = [];
    for (var i = 0; i < PARTICLE_AMOUNT; i++) {
      self.particles.push(new Particle(self, self.size));
    }

    // per frame jobs
    self.tick = function() {
      if (self.stopped) {
        return;
      }
      if (!skip) {
        self.update();
        self.draw(screen, self.size);
        frameCount++;
      }
      skip = !skip;
      self.animationRequest = window.requestAnimationFrame(self.tick);
    };

    // setup cheeky hidden controls
    window.onkeydown = function(e) {
      var key = e.keyCode;

      if (key === KEYS.UP) {
        self.particles.push(new Particle(self, self.size));
        particleAmount = self.particles.length;
      } else if (key === KEYS.DOWN) {
        self.particles.shift();
        particleAmount = self.particles.length;
      } else if (key === KEYS.I) {
        PARTICLE_DRAG_MOD -= 0.01;
        _.debug("Drag modifier: " + PARTICLE_DRAG_MOD);
      } else if (key === KEYS.O) {
        PARTICLE_DRAG_MOD += 0.01;
        _.debug("Drag modifier: " + PARTICLE_DRAG_MOD);
      } else if (key === KEYS.RIGHT) {
        _.cheekyRespeed(VISUAL_RESPEED_STEP, true, self);
      } else if (key === KEYS.LEFT) {
        _.cheekyRespeed(-(VISUAL_RESPEED_STEP), true, self);
      } else if (key === KEYS.SPACE) {
        self.stop();
        self.changeHue();
        self.start();
      } else if (key === KEYS.M) {
        PARTICLE_DRAGS = !PARTICLE_DRAGS;
        _.cheekyRespeed(PARTICLE_DRAGS ? 4 : 1.5, false, self);
      } else if (key === KEYS.F) {
        SHOW_CONSOLE_FPS = !SHOW_CONSOLE_FPS;
        ParticleVisual.debugDetails(SHOW_CONSOLE_FPS);
      }
    };

    // first tick to start things off
    self.tick();
  };

  Visual.prototype = {

    update: function() {
      this.particles.forEach(function(body) {
        body.update();
      });
    },

    draw: function(screen, size) {
      if (!PARTICLE_DRAGS) {
        screen.clearRect(0, 0, size.x, size.y);
      } else {
        var drag = 0.952 * PARTICLE_DRAG_MOD;
        screen.globalCompositeOperation = 'destination-in';
        screen.fillStyle = 'hsla(0, 0%, 100%, '+drag+')';
        screen.fillRect(0, 0, this.size.x, this.size.y);
        screen.globalCompositeOperation = 'source-over';
      }
      this.particles.forEach(function(particle) {
        _.drawRect(screen, particle);
      });
    },

    // pause drawing
    stop: function() {
      if (!this.stopped) {
        _.debug('Paused drawing.');
        this.stopped = true;
        window.cancelAnimationFrame(this.animationRequest);
      } else {
      _.debug('Failed attempt pausing drawing.');
    }
    },

    // unpause drawing
    start: function() {
      if (this.stopped) {
        _.debug('Unpausing drawing.');
        this.stopped = false;
        this.tick();
      } else {
        _.debug('Failed attempt unpausing drawing.');
      }
    },

    // proportionately move all visual content along resizing canvas
    resize: function(width, height) {
      var self = this;
      self.stop();
      self.particles.forEach(function(particle) {
        particle.rePosition(self.size, {x: width, y: height});
      });

      self.size = {
        x: width,
        y: height
      };
      self.start();
    },

    // changes relative hue of all content
    changeHue: function(hue) {
      var newHue = hue ? hue : VISUAL_HUES[Math.ceil(Math.random() * VISUAL_HUES.length) - 1];
      _.debug('New HUE: ' + newHue);
      var change = -(VISUAL_HUE - newHue);
      VISUAL_HUE = newHue;
      this.particles.forEach(function(particle) {
        particle.adjustHue(change);
      });
    },

    // changes relative lighting of all content
    changeLighting: function(light) {
      var change = -(VISUAL_LIGHTING - light);
      this.particles.forEach(function(particle) {
        particle.adjustLighting(change);
      });
    },

    _isCollision: function(ours, theirs) {
      return (theirs < 0 || theirs > ours);
    },

    _isXCollision: function(theirs) {
      return this._isCollision(this.size.x, theirs);
    },

    _isYCollision: function(theirs) {
      return this._isCollision(this.size.y, theirs);
    }

  };

  /**
   * A single particle, holding state and methods to change.
   */
  var Particle = function(visual, screenSize) {
    var randomSize = 2 + _.inRange(PARTICLE_MIN_SIZE, PARTICLE_MAX_SIZE),
        randomBlinkRate = _.zeroTo(PARTICLE_BLINK_RATE);

    this.visual = visual;
    this.size = {
      x: randomSize,
      y: randomSize
    };
    this.center = {
      x: _.zeroTo(screenSize.x),
      y: _.zeroTo(screenSize.y)
    };
    this.color = {
      h: _.roofRange(VISUAL_HUE, 5),
      s: _.roofRange(VISUAL_SATURATION, 5),
      l: _.inRange(VISUAL_LIGHTING - 40, VISUAL_LIGHTING),
      a: 1,
      getHsla: function() {
        return 'hsla('+this.h+','+this.s+'%,'+this.l+'%,'+this.a+')';
      }
    };
    this.dimming = true;
    this.blinkRate = randomBlinkRate;

  };

  Particle.prototype = {

    update: function() {
      /* Color */
      this.blink();

      /* Center */
      this.jitterCenter();
    },

    blink: function() {
      if (this.color.a >= 1) {
        this.dimming = true;
      } else if (this.color.a <= 0) {
        this.dimming = false;
      }

      this.color.a += this.dimming ? -(this.blinkRate) : this.blinkRate;
      // this.color.s = _.roofRange((this.color.a * 20)^10, 10);
    },

    jitterCenter: function() {
      this.center.x += (_.randomSign() * _.zeroTo(PARTICLE_JITTER_RATE));
      this.center.y += (_.randomSign() * _.zeroTo(PARTICLE_JITTER_RATE));
      if (this.visual._isXCollision(this.center.x)) {
        this.center.x = this.center.x > this.visual.size.x ? this.visual.size.x - 1 : 1;
      }

      if (this.visual._isYCollision(this.center.y)) {
        this.center.y = this.center.y > this.visual.size.y ? this.visual.size.y - 1 : 1;
      }

      this.center.y = Math.round(this.center.y);
      this.center.y = Math.round(this.center.y);
    },

    rePosition: function(oldSize, newSize) {
      this.center.x = newSize.x / (oldSize.x / this.center.x);
      this.center.y = newSize.y / (oldSize.y / this.center.y);
    },

    adjustHue: function(amount) {
      this.color.h = this.color.h + amount;
    },

    adjustLighting: function(amount) {
      this.color.l = this.color.l + amount;
    }

  };

  /**
   * Utility object. Bad programmer. Bad.
   */
  var _ = {

    zeroTo: function(max) {
      return Math.random() * max;
    },

    randomSign: function() {
      return Math.random() > 0.5 ? -1 : 1;
    },

    roofRange: function(roof, range) {
      return (Math.random() * range) + (roof - range);
    },

    inRange: function(min, max) {
      return min + _.zeroTo(max - min);
    },

    getCenter: function(screenSize) {
      return {
        x: screenSize.x / 2,
        y: screenSize.y / 2
      };
    },

    drawRect: function(screen, rect) {

      if (rect.color) {
        screen.fillStyle = rect.color.getHsla();
      }

      screen.fillRect(rect.center.x - rect.size.x / 2,
                      rect.center.y - rect.size.y / 2,
                      rect.size.x,
                      rect.size.y);
    },

    debug: function(str) {
      if (DEBUG) {
        console.log('[debug] ' + str);
      }
    },

    cheekyRespeed: function(amount, relative, visual) {
      _.debug("Speed change.");
      _.debug("Previous:");
      _.debug("  VISUAL_SPEED_MULT = " + VISUAL_SPEED_MULT);
      _.debug("  PARTICLE_JITTER_RATE = " + PARTICLE_JITTER_RATE);
      _.debug("  PARTICLE_BLINK_RATE = " + PARTICLE_BLINK_RATE);
      visual = visual || false;
      var alreadyStopped = VISUAL_SPEED_MULT === 0;

      if (relative) {
        VISUAL_SPEED_MULT += amount;
      } else {
        VISUAL_SPEED_MULT = amount;
      }
      VISUAL_SPEED_MULT = VISUAL_SPEED_MULT < 0 ? 0 : VISUAL_SPEED_MULT;
      PARTICLE_JITTER_RATE = 0.45 * VISUAL_SPEED_MULT;
      PARTICLE_BLINK_RATE = 0.01 * VISUAL_SPEED_MULT;

      if (visual) {
        if (VISUAL_SPEED_MULT === 0 && !alreadyStopped) {
          visual.stop();
        } else if (alreadyStopped && VISUAL_SPEED_MULT > 0) {
          visual.start();
        }
      }

      _.debug("Current:");
      _.debug("  VISUAL_SPEED_MULT = " + VISUAL_SPEED_MULT);
      _.debug("  PARTICLE_JITTER_RATE = " + PARTICLE_JITTER_RATE);
      _.debug("  PARTICLE_BLINK_RATE = " + PARTICLE_BLINK_RATE);
    }
  };

  // Init on browser window
  window.onload = function() {
    _.cheekyRespeed(0, true);

    var canvas = document.getElementById('particles'),
        canvasContext = canvas.getContext('2d'),
        originalSize = getSize(),
        currentSize;

    window.visual;

    window.onresize = resizeCanvas;

    setElementDimensions(canvas, originalSize.width, originalSize.height);

    function resizeCanvas () {
      var size = getSize();

      if (window.visual) {
        setTimeout(function() {
          var newSize = getSize();
          if (newSize.width === size.width &&
              newSize.height === size.height) {

            setElementDimensions(canvas, size.width, size.height);
            window.visual.resize(size.width, size.height);
            currentSize = size;
            _.debug('Resized: ' + size.width + 'px * ' + size.height + 'px.');

          }
        }, 1500);
      } else {
        window.visual = new Visual(canvasContext, size.width, size.height);
        currentSize = size;
      }

    }

    function getSize() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }

    function setElementDimensions(el, width, height) {
      el.setAttribute('width', width.toString());
      el.setAttribute('height', height.toString());
    }

    // init canvas
    resizeCanvas();

    // init power saving
    window.addEventListener('focus', function() {
      _.debug('In focus');
      window.visual.start();
    });
    window.addEventListener('blur', function() {
      _.debug('Now blurred');
      window.visual.stop();
    });

    if (SHOW_CONSOLE_FPS) {
      ParticleVisual.debugDetails(SHOW_CONSOLE_FPS);
    }

  };

})();
