function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
export var TitleScreen = /*#__PURE__*/ function() {
    "use strict";
    function TitleScreen(onStartGameCallback) {
        _class_call_check(this, TitleScreen);
        // Bound version for event listener
        _define_property(this, "_boundResizeCanvas", this._resizeCanvas.bind(this));
        this.onStartGameCallback = onStartGameCallback;
        this.container = null;
        this.isVisible = false;
        this.backgroundCanvas = null;
        this.backgroundCtx = null;
        this.particles = [];
        this.animationFrameId = null;
        this.lastParticleTime = 0;
        this.particleInterval = 500; // ms between new particles
        this.mousePosition = {
            x: -1000,
            y: -1000
        }; // Initialize mouse off-screen
        this.repulsionRadius = 150; // Pixels within which particles are affected
        this.repulsionStrength = 0.5; // How strongly particles are pushed
        this._createElements();
        this._injectStyles(); // Inject CSS for animations
        this._boundOnMouseMove = this._onMouseMove.bind(this);
    }
    _create_class(TitleScreen, [
        {
            key: "_createElements",
            value: function _createElements() {
                var _this = this;
                this.container = document.createElement('div');
                this.container.id = 'title-screen-container';
                this.container.style.position = 'fixed';
                this.container.style.top = '0';
                this.container.style.left = '0';
                this.container.style.width = '100%';
                this.container.style.height = '100%';
                // Background color set on canvas now
                this.container.style.display = 'flex';
                this.container.style.flexDirection = 'column';
                this.container.style.justifyContent = 'center';
                this.container.style.alignItems = 'center';
                this.container.style.zIndex = '10000';
                this.container.style.color = 'white'; // Default text color, will be overridden by specific elements
                // Default fontFamily, will be overridden by specific elements
                this.container.style.textAlign = 'center';
                this.container.style.padding = '20px';
                this.container.style.boxSizing = 'border-box';
                this.container.style.overflow = 'hidden'; // Prevent particles from showing scrollbars if they go off edge slightly
                // Background Canvas
                this.backgroundCanvas = document.createElement('canvas');
                this.backgroundCanvas.style.position = 'absolute';
                this.backgroundCanvas.style.top = '0';
                this.backgroundCanvas.style.left = '0';
                this.backgroundCanvas.style.width = '100%';
                this.backgroundCanvas.style.height = '100%';
                this.backgroundCanvas.style.zIndex = '0'; // Behind content
                this.container.appendChild(this.backgroundCanvas);
                this.backgroundCtx = this.backgroundCanvas.getContext('2d');
                // Content elements
                var title = document.createElement('h1');
                title.textContent = 'Food Forest Friends';
                title.style.fontFamily = "'Fredoka One', 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif";
                title.style.fontSize = 'clamp(3rem, 10vw, 6rem)';
                title.style.color = '#69A24C'; // Friendly, rich green
                title.style.textShadow = '2px 2px 3px rgba(0,0,0,0.35)'; // Slightly softer shadow
                title.style.margin = '0 0 20px 0';
                title.style.position = 'relative'; // Ensure stacking context
                title.style.zIndex = '1';
                title.style.animation = 'titleBreathe 4s ease-in-out infinite';
                var tagline = document.createElement('p');
                tagline.textContent = 'The Canopy Oasis Project';
                tagline.style.fontFamily = "'Nunito', 'Arial', sans-serif";
                tagline.style.fontSize = 'clamp(1.2rem, 4vw, 1.8rem)';
                tagline.style.color = '#B2D8B6'; // Soft, light green
                tagline.style.marginBottom = '40px';
                tagline.style.maxWidth = '600px';
                tagline.style.position = 'relative'; // Ensure stacking context
                tagline.style.zIndex = '1';
                var startButton = document.createElement('button');
                startButton.id = 'start-game-button';
                startButton.textContent = 'Start Planting';
                startButton.style.padding = '15px 30px';
                startButton.style.fontSize = 'clamp(1rem, 3vw, 1.5rem)';
                startButton.style.backgroundColor = '#D48C20'; // Warm, earthy orange/brown
                startButton.style.color = 'white';
                startButton.style.border = 'none';
                startButton.style.borderRadius = '8px';
                startButton.style.cursor = 'pointer';
                startButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                startButton.style.transition = 'background-color 0.3s ease, transform 0.1s ease';
                startButton.style.position = 'relative'; // Ensure stacking context
                startButton.style.zIndex = '1';
                startButton.style.animation = 'startButtonPulse 2s ease-in-out infinite';
                startButton.onmouseover = function() {
                    startButton.style.backgroundColor = '#C07A1B';
                }; // Darker shade for hover
                startButton.onmouseout = function() {
                    startButton.style.backgroundColor = '#D48C20';
                };
                startButton.onmousedown = function() {
                    startButton.style.transform = 'scale(0.98)';
                };
                startButton.onmouseup = function() {
                    startButton.style.transform = 'scale(1)';
                };
                startButton.addEventListener('click', function() {
                    _this.onStartGameCallback();
                });
                this.container.appendChild(title);
                this.container.appendChild(tagline);
                this.container.appendChild(startButton);
            }
        },
        {
            key: "_resizeCanvas",
            value: function _resizeCanvas() {
                if (this.backgroundCanvas) {
                    this.backgroundCanvas.width = this.container.clientWidth;
                    this.backgroundCanvas.height = this.container.clientHeight;
                }
            }
        },
        {
            key: "_createParticle",
            value: function _createParticle() {
                var x = Math.random() * this.backgroundCanvas.width;
                var y = Math.random() * this.backgroundCanvas.height;
                var radius = Math.random() * 50 + 50; // Radius between 50 and 100
                var color = "rgba(".concat(Math.random() * 50 + 100, ", ").concat(Math.random() * 50 + 150, ", ").concat(Math.random() * 50 + 200, ", ").concat(Math.random() * 0.1 + 0.05, ")"); // Light blues, very transparent
                var speedY = -(Math.random() * 0.3 + 0.1); // Slow upward movement
                var speedX = (Math.random() - 0.5) * 0.2; // Slight horizontal drift
                // Store original speeds for returning to normal movement
                return {
                    x: x,
                    y: y,
                    radius: radius,
                    color: color,
                    baseSpeedX: speedX,
                    baseSpeedY: speedY,
                    currentSpeedX: speedX,
                    currentSpeedY: speedY,
                    opacity: 1,
                    life: 100
                };
            }
        },
        {
            key: "_onMouseMove",
            value: function _onMouseMove(event) {
                if (this.backgroundCanvas) {
                    var rect = this.backgroundCanvas.getBoundingClientRect();
                    this.mousePosition.x = event.clientX - rect.left;
                    this.mousePosition.y = event.clientY - rect.top;
                }
            }
        },
        {
            key: "_updateAndDrawParticles",
            value: function _updateAndDrawParticles(timestamp) {
                if (!this.backgroundCtx || !this.backgroundCanvas) return;
                this.backgroundCtx.fillStyle = 'rgba(0, 40, 80, 0.95)'; // Slightly darker base for more contrast
                this.backgroundCtx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
                if (timestamp - this.lastParticleTime > this.particleInterval && this.particles.length < 15) {
                    this.particles.push(this._createParticle());
                    this.lastParticleTime = timestamp;
                }
                for(var i = this.particles.length - 1; i >= 0; i--){
                    var p = this.particles[i];
                    // Mouse interaction
                    var dx = p.x - this.mousePosition.x;
                    var dy = p.y - this.mousePosition.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < this.repulsionRadius) {
                        var forceDirectionX = dx / distance;
                        var forceDirectionY = dy / distance;
                        // Make repulsion stronger closer to mouse
                        var force = (this.repulsionRadius - distance) / this.repulsionRadius * this.repulsionStrength;
                        p.currentSpeedX = p.baseSpeedX + forceDirectionX * force;
                        p.currentSpeedY = p.baseSpeedY + forceDirectionY * force;
                    } else {
                        // Gradually return to base speed if not repelled
                        p.currentSpeedX += (p.baseSpeedX - p.currentSpeedX) * 0.1; // Easing back
                        p.currentSpeedY += (p.baseSpeedY - p.currentSpeedY) * 0.1;
                    }
                    p.x += p.currentSpeedX;
                    p.y += p.currentSpeedY;
                    p.life -= 0.1; // Controls fade speed and lifespan
                    if (p.life <= 0 || p.y + p.radius < 0 || p.y - p.radius > this.backgroundCanvas.height || p.x + p.radius < 0 || p.x - p.radius > this.backgroundCanvas.width) {
                        this.particles.splice(i, 1);
                    } else {
                        this.backgroundCtx.beginPath();
                        this.backgroundCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
                        this.backgroundCtx.fillStyle = p.color.replace(/,\s?([\d.]+)\)/, ", ".concat(Math.max(0, p.life / 100 * parseFloat(RegExp.$1)), ")")); // Fade opacity with life
                        this.backgroundCtx.fill();
                    }
                }
            }
        },
        {
            key: "_animateBackground",
            value: function _animateBackground(timestamp) {
                this._updateAndDrawParticles(timestamp);
                this.animationFrameId = requestAnimationFrame(this._animateBackground.bind(this));
            }
        },
        {
            key: "show",
            value: function show() {
                if (!this.container.parentNode) {
                    document.body.appendChild(this.container);
                }
                this._resizeCanvas(); // Ensure canvas is sized correctly on show
                this.container.style.display = 'flex';
                this.isVisible = true;
                if (!this.animationFrameId) {
                    this.particles = []; // Reset particles on show
                    this.lastParticleTime = performance.now();
                    this.animationFrameId = requestAnimationFrame(this._animateBackground.bind(this));
                }
                // Add resize listener for canvas and mouse move listener
                window.addEventListener('resize', this._boundResizeCanvas);
                this.container.addEventListener('mousemove', this._boundOnMouseMove);
            }
        },
        {
            key: "hide",
            value: function hide() {
                this.container.style.display = 'none';
                this.isVisible = false;
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }
                window.removeEventListener('resize', this._boundResizeCanvas);
                this.container.removeEventListener('mousemove', this._boundOnMouseMove);
            }
        },
        {
            key: "destroy",
            value: function destroy() {
                this.hide(); // Stop animation and remove resize listener
                if (this.container && this.container.parentNode) {
                    this.container.parentNode.removeChild(this.container);
                }
                this.container = null;
                this.backgroundCanvas = null;
                this.backgroundCtx = null;
                this.particles = [];
            }
        },
        {
            key: "_injectStyles",
            value: function _injectStyles() {
                var styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.innerText = "\n            @keyframes titleBreathe {\n                0%, 100% { transform: scale(1); }\n                50% { transform: scale(1.03); }\n            }\n            @keyframes startButtonPulse {\n                0%, 100% { transform: scale(1); box-shadow: 0 4px 8px rgba(0,0,0,0.3); }\n                50% { transform: scale(1.05); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }\n            }\n        ";
                document.head.appendChild(styleSheet);
            }
        }
    ]);
    return TitleScreen;
}();
