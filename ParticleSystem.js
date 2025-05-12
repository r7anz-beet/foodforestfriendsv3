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
import * as THREE from 'three';
import { Particle } from './Particle.js';
var DEFAULT_SPARKLE_COLOR = 0xFFFF00; // Bright Yellow
var DEFAULT_SPARKLE_COUNT = 12;
var DEFAULT_SPARKLE_SPEED_MIN = 0.7;
var DEFAULT_SPARKLE_SPEED_MAX = 1.2;
var PARTICLE_BASE_SIZE = 0.06;
var PARTICLE_LIFETIME_MIN = 0.5;
var PARTICLE_LIFETIME_MAX = 0.9;
export var ParticleSystem = /*#__PURE__*/ function() {
    "use strict";
    function ParticleSystem(scene) {
        _class_call_check(this, ParticleSystem);
        this.scene = scene;
        this.particles = [];
    }
    _create_class(ParticleSystem, [
        {
            key: "createSparkleEffect",
            value: function createSparkleEffect(originPosition) {
                var count = DEFAULT_SPARKLE_COUNT;
                var color = new THREE.Color(DEFAULT_SPARKLE_COLOR);
                for(var i = 0; i < count; i++){
                    var speed = THREE.MathUtils.randFloat(DEFAULT_SPARKLE_SPEED_MIN, DEFAULT_SPARKLE_SPEED_MAX);
                    var angle = Math.random() * Math.PI * 2; // Spread in XZ plane
                    var upwardAngle = Math.PI / 2 - Math.random() * Math.PI / 6; // Mostly upward, slight cone
                    var velocity = new THREE.Vector3(Math.cos(angle) * Math.cos(upwardAngle) * speed, Math.sin(upwardAngle) * speed, Math.sin(angle) * Math.cos(upwardAngle) * speed);
                    // Start particles slightly above the plot center and spread a bit
                    var spawnOffset = new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.15, (Math.random() - 0.5) * 0.3);
                    var particlePosition = originPosition.clone().add(spawnOffset);
                    var lifetime = THREE.MathUtils.randFloat(PARTICLE_LIFETIME_MIN, PARTICLE_LIFETIME_MAX);
                    var size = PARTICLE_BASE_SIZE * (0.8 + Math.random() * 0.4);
                    var particle = new Particle(particlePosition, velocity, color, size, lifetime, this.scene);
                    this.particles.push(particle);
                }
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                for(var i = this.particles.length - 1; i >= 0; i--){
                    var particle = this.particles[i];
                    particle.update(deltaTime);
                    if (!particle.isAlive()) {
                        particle.dispose();
                        this.particles.splice(i, 1);
                    }
                }
            }
        },
        {
            key: "createMedalAchievedEffect",
            value: function createMedalAchievedEffect(originPosition, medalType) {
                var count = 30; // More particles for a bigger celebration
                var particleColor;
                var speedMin = 1.0;
                var speedMax = 2.0;
                var lifetimeMin = 1.0;
                var lifetimeMax = 1.8;
                var baseSize = PARTICLE_BASE_SIZE * 1.5;
                switch(medalType){
                    case 'Platinum':
                        particleColor = new THREE.Color(0xE5E4E2);
                        count = 50;
                        baseSize *= 1.2;
                        break;
                    case 'Gold':
                        particleColor = new THREE.Color(0xFFD700);
                        count = 40;
                        break;
                    case 'Silver':
                        particleColor = new THREE.Color(0xC0C0C0);
                        break;
                    case 'Bronze':
                        particleColor = new THREE.Color(0xCD7F32);
                        break;
                    default:
                        particleColor = new THREE.Color(0xFFFFFF); // Default white if type unknown
                }
                for(var i = 0; i < count; i++){
                    var speed = THREE.MathUtils.randFloat(speedMin, speedMax);
                    // Radial burst, slightly upward
                    var phi = Math.random() * Math.PI * 2; // Angle around Y axis
                    var theta = Math.PI / 2 - Math.random() * Math.PI / 3; // Angle from Y-axis (more upwards)
                    var velocity = new THREE.Vector3(Math.sin(theta) * Math.cos(phi) * speed, Math.cos(theta) * speed, Math.sin(theta) * Math.sin(phi) * speed);
                    // Particles spawn around the origin position
                    var spawnOffset = new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5);
                    var particlePosition = originPosition.clone().add(spawnOffset);
                    var lifetime = THREE.MathUtils.randFloat(lifetimeMin, lifetimeMax);
                    var size = baseSize * (0.7 + Math.random() * 0.6);
                    var particle = new Particle(particlePosition, velocity, particleColor, size, lifetime, this.scene);
                    this.particles.push(particle);
                }
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                this.particles.forEach(function(particle) {
                    return particle.dispose();
                });
                this.particles = [];
                this.scene = null;
            }
        }
    ]);
    return ParticleSystem;
}();
