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
var DEFAULT_PARTICLE_SIZE = 0.08; // Smaller, more sparkle-like
var DEFAULT_PARTICLE_LIFETIME = 0.7; // Shorter lifetime for quick sparkle
export var Particle = /*#__PURE__*/ function() {
    "use strict";
    function Particle(position, velocity, color) {
        var size = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : DEFAULT_PARTICLE_SIZE, lifetime = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : DEFAULT_PARTICLE_LIFETIME, scene = arguments.length > 5 ? arguments[5] : void 0;
        _class_call_check(this, Particle);
        this.scene = scene;
        this.velocity = velocity.clone();
        this.lifetime = lifetime;
        this.age = 0;
        var material = new THREE.SpriteMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            // blending: THREE.AdditiveBlending, // Optional: for a brighter, overlapping sparkle
            sizeAttenuation: true
        });
        this.mesh = new THREE.Sprite(material);
        this.mesh.scale.set(size, size, size);
        this.mesh.position.copy(position);
        this.scene.add(this.mesh);
    }
    _create_class(Particle, [
        {
            key: "update",
            value: function update(deltaTime) {
                this.age += deltaTime;
                if (!this.isAlive()) {
                    return;
                }
                this.mesh.position.addScaledVector(this.velocity, deltaTime);
                this.velocity.y -= 2.0 * deltaTime; // Add a little gravity/drag to make them arc slightly or slow down upwards motion
                // Fade out effect
                var lifeRatio = this.age / this.lifetime;
                this.mesh.material.opacity = 1.0 - Math.pow(lifeRatio, 2); // Faster fade towards the end
            // Optional: shrink effect could be added here too
            // const scale = DEFAULT_PARTICLE_SIZE * (1.0 - lifeRatio);
            // this.mesh.scale.set(scale, scale, scale);
            }
        },
        {
            key: "isAlive",
            value: function isAlive() {
                return this.age < this.lifetime;
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.mesh) {
                    if (this.mesh.material) this.mesh.material.dispose();
                    // Sprite geometry is shared and managed by Three.js, no need to dispose sprite's geometry
                    if (this.scene) {
                        this.scene.remove(this.mesh);
                    }
                }
                this.mesh = null;
                this.scene = null;
            }
        }
    ]);
    return Particle;
}();
