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
export var SceneSetup = /*#__PURE__*/ function() {
    "use strict";
    function SceneSetup(renderDiv) {
        _class_call_check(this, SceneSetup);
        this.renderDiv = renderDiv;
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initLighting();
        this.initGround();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize(); // Initial call
    }
    _create_class(SceneSetup, [
        {
            key: "initScene",
            value: function initScene() {
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0xade8f4); // Light blue sky
            }
        },
        {
            key: "initCamera",
            value: function initCamera() {
                var aspect = this.renderDiv.clientWidth / this.renderDiv.clientHeight;
                this.frustumSize = 15; // Default, will be adjusted by Game
                this.camera = new THREE.OrthographicCamera(this.frustumSize * aspect / -2, this.frustumSize * aspect / 2, this.frustumSize / 2, this.frustumSize / -2, 0.1, 100);
                this.camera.position.set(5, 10, 5);
                this.camera.lookAt(0, 0, 0);
            }
        },
        {
            key: "setCameraZoom",
            value: function setCameraZoom(newFrustumSize) {
                this.frustumSize = newFrustumSize;
                this.onWindowResize(); // Recalculate projection matrix
            }
        },
        {
            key: "initRenderer",
            value: function initRenderer() {
                this.renderer = new THREE.WebGLRenderer({
                    antialias: true
                });
                this.renderer.setSize(this.renderDiv.clientWidth, this.renderDiv.clientHeight);
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                this.renderDiv.appendChild(this.renderer.domElement);
            }
        },
        {
            key: "initLighting",
            value: function initLighting() {
                var ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
                this.scene.add(ambientLight);
                var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(5, 10, 7.5);
                directionalLight.castShadow = true;
                directionalLight.shadow.mapSize.width = 1024;
                directionalLight.shadow.mapSize.height = 1024;
                directionalLight.shadow.camera.near = 0.5;
                directionalLight.shadow.camera.far = 50;
                // Make shadow camera frustum cover a reasonable area around origin
                var shadowCamSize = 15;
                directionalLight.shadow.camera.left = -shadowCamSize;
                directionalLight.shadow.camera.right = shadowCamSize;
                directionalLight.shadow.camera.top = shadowCamSize;
                directionalLight.shadow.camera.bottom = -shadowCamSize;
                this.scene.add(directionalLight);
            }
        },
        {
            key: "initGround",
            value: function initGround() {
                var groundGeometry = new THREE.PlaneGeometry(100, 100);
                var groundMaterial = new THREE.MeshStandardMaterial({
                    color: 0x90be6d
                }); // Grassy green
                var ground = new THREE.Mesh(groundGeometry, groundMaterial);
                ground.rotation.x = -Math.PI / 2;
                ground.position.y = -0.05; // Slightly below plots
                ground.receiveShadow = true;
                this.scene.add(ground);
            }
        },
        {
            key: "onWindowResize",
            value: function onWindowResize() {
                var aspect = this.renderDiv.clientWidth / this.renderDiv.clientHeight;
                this.camera.left = this.frustumSize * aspect / -2;
                this.camera.right = this.frustumSize * aspect / 2;
                this.camera.top = this.frustumSize / 2;
                this.camera.bottom = this.frustumSize / -2;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.renderDiv.clientWidth, this.renderDiv.clientHeight);
            }
        }
    ]);
    return SceneSetup;
}();
