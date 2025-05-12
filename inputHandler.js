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
export var InputHandler = /*#__PURE__*/ function() {
    "use strict";
    function InputHandler(camera, scene, clickableObjects, callback, audioManager) {
        _class_call_check(this, InputHandler);
        this.camera = camera;
        this.scene = scene;
        this.clickableObjects = clickableObjects; // These should be the plot meshes themselves
        this.callback = callback;
        this.audioManager = audioManager; // Store AudioManager instance
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredObject = null;
        this.isDisabled = false; // New flag to disable input handling
        this.firstInteractionDone = false; // To resume AudioContext on first click
        this.boundOnMouseDown = this.onMouseDown.bind(this);
        this.boundOnMouseMove = this.onMouseMove.bind(this);
        window.addEventListener('mousedown', this.boundOnMouseDown, false);
        window.addEventListener('mousemove', this.boundOnMouseMove, false);
    }
    _create_class(InputHandler, [
        {
            key: "updateMousePosition",
            value: function updateMousePosition(event) {
                var renderCanvas = this.camera.userData.rendererDOMElement || document.querySelector('canvas');
                if (!renderCanvas) return false;
                var rect = renderCanvas.getBoundingClientRect();
                this.mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
                this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                return true;
            }
        },
        {
            key: "onMouseDown",
            value: function onMouseDown(event) {
                if (this.isDisabled) return;
                event.preventDefault();
                if (!this.firstInteractionDone) {
                    this.audioManager.ensureContextResumed();
                    this.firstInteractionDone = true;
                }
                if (!this.updateMousePosition(event)) return;
                this.raycaster.setFromCamera(this.mouse, this.camera);
                var intersects = this.raycaster.intersectObjects(this.clickableObjects, false);
                if (intersects.length > 0) {
                    this.callback(intersects[0].object);
                }
            }
        },
        {
            key: "onMouseMove",
            value: function onMouseMove(event) {
                if (this.isDisabled) {
                    // If disabled, ensure no hover effects remain
                    if (this.hoveredObject && this.hoveredObject.userData.plot) {
                        this.hoveredObject.userData.plot.onPointerLeave();
                    }
                    this.hoveredObject = null;
                    return;
                }
                event.preventDefault();
                if (!this.updateMousePosition(event)) return;
                this.raycaster.setFromCamera(this.mouse, this.camera);
                var intersects = this.raycaster.intersectObjects(this.clickableObjects, false);
                if (intersects.length > 0) {
                    var intersectedMesh = intersects[0].object;
                    if (this.hoveredObject !== intersectedMesh) {
                        // Left previous object
                        if (this.hoveredObject && this.hoveredObject.userData.plot) {
                            this.hoveredObject.userData.plot.onPointerLeave();
                        }
                        // Entered new object
                        this.hoveredObject = intersectedMesh;
                        if (this.hoveredObject.userData.plot) {
                            this.hoveredObject.userData.plot.onPointerEnter();
                        }
                    }
                } else {
                    // No intersection, ensure previous object is unhovered
                    if (this.hoveredObject && this.hoveredObject.userData.plot) {
                        this.hoveredObject.userData.plot.onPointerLeave();
                    }
                    this.hoveredObject = null;
                }
            }
        },
        {
            key: "disable",
            value: function disable() {
                this.isDisabled = true;
                // Clear any existing hover effect
                if (this.hoveredObject && this.hoveredObject.userData.plot) {
                    this.hoveredObject.userData.plot.onPointerLeave();
                }
                this.hoveredObject = null;
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                window.removeEventListener('mousedown', this.boundOnMouseDown, false);
                window.removeEventListener('mousemove', this.boundOnMouseMove, false);
            }
        }
    ]);
    return InputHandler;
}();
