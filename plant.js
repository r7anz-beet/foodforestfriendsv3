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
var STAGE_SEEDLING = 0;
var STAGE_SPROUT = 1;
var STAGE_MATURE = 2;
var FERTILIZE_EFFECT_DURATION = 0.5; // seconds
var FERTILIZE_EFFECT_COLOR = 0x98FF98; // A pale, vibrant green
export var Plant = /*#__PURE__*/ function() {
    "use strict";
    function Plant(typeConfig, plotSize) {
        _class_call_check(this, Plant);
        this.typeConfig = typeConfig;
        this.plotSize = plotSize;
        this.stage = STAGE_SEEDLING;
        this.growthTimer = 0;
        this.productionTimer = 0; // For 'produce' type plants
        this.hasProduce = false; // For 'produce' type plants
        this.spreadTimer = 0; // For 'consume' types that canSpread
        this._wantsToSpread = false; // Internal flag
        this.currentWaterLevel = this.typeConfig.maxWaterLevel;
        this.waterTimer = this.typeConfig.waterInterval || Infinity; // Timer until water is needed
        this.needsWatering = false; // Flag if plant is currently thirsty
        this.isGrowthPausedByWater = false; // True if growth/production stops due to lack of water
        this.originalColor = new THREE.Color(this.typeConfig.stages[STAGE_SEEDLING].color);
        this.currentBaseMaterial = new THREE.MeshStandardMaterial({
            color: this.originalColor.getHex()
        });
        this.mesh = this.createMeshForStage(STAGE_SEEDLING);
        // Position set within createMeshForStage now
        this.matureGlowMaterial = null;
        this.isFertilizeEffectActive = false;
        this.fertilizeEffectTimer = 0;
        this.preEffectMaterialColor = new THREE.Color(); // To store color before effect
        if (this.typeConfig.stages[STAGE_MATURE].glowColor) {
            this.matureGlowMaterial = new THREE.MeshBasicMaterial({
                color: this.typeConfig.stages[STAGE_MATURE].glowColor,
                transparent: true,
                opacity: 0.7 // Initial opacity, will be pulsed
            });
        }
    }
    _create_class(Plant, [
        {
            key: "createMeshForStage",
            value: function createMeshForStage(stage) {
                var stageConfig = this.typeConfig.stages[stage];
                this.originalColor.setHex(stageConfig.color); // Update original color for the new stage
                // Clear previous children if any
                if (this.mesh) {
                    while(this.mesh.children.length > 0){
                        var child = this.mesh.children[0];
                        this.mesh.remove(child);
                        if (child.geometry) child.geometry.dispose();
                    }
                    if (this.mesh.geometry) this.mesh.geometry.dispose();
                }
                var group = new THREE.Group();
                // Stem/Base
                var baseHeight = stageConfig.height;
                var baseRadius = stageConfig.radius;
                var geometry = new THREE.CylinderGeometry(baseRadius * 0.7, baseRadius, baseHeight, 8);
                var baseMesh = new THREE.Mesh(geometry, this.currentBaseMaterial);
                baseMesh.castShadow = true;
                baseMesh.receiveShadow = true;
                baseMesh.position.y = 0;
                group.add(baseMesh);
                // Topper
                if (stageConfig.topperType && stageConfig.topperRadius && stageConfig.topperColor) {
                    var topperGeo;
                    if (stageConfig.topperType === 'sphere') {
                        topperGeo = new THREE.SphereGeometry(stageConfig.topperRadius, 8, 6);
                    } else {
                        topperGeo = new THREE.SphereGeometry(stageConfig.topperRadius, 8, 6);
                    }
                    var topperMaterial = new THREE.MeshStandardMaterial({
                        color: stageConfig.topperColor
                    });
                    if (!this.extraMaterials) this.extraMaterials = [];
                    this.extraMaterials.push(topperMaterial);
                    var topperMesh = new THREE.Mesh(topperGeo, topperMaterial);
                    topperMesh.position.y = baseHeight / 2 + stageConfig.topperRadius * 0.8;
                    topperMesh.castShadow = true;
                    topperMesh.receiveShadow = true;
                    group.add(topperMesh);
                }
                this.currentBaseMaterial.color.setHex(this.originalColor.getHex()); // Set initial color
                this.updateWaterVisuals(); // Apply water effect if needed
                group.position.y = 0.1 + stageConfig.height / 2;
                return group;
            }
        },
        {
            key: "updateMesh",
            value: function updateMesh() {
                var oldMesh = this.mesh;
                this.mesh = this.createMeshForStage(this.stage);
                if (oldMesh && oldMesh.parent) {
                    oldMesh.parent.add(this.mesh);
                    oldMesh.parent.remove(oldMesh);
                }
                this.applyGlowEffect();
            }
        },
        {
            key: "isReadyToHarvest",
            value: function isReadyToHarvest() {
                if (this.typeConfig.harvestType === 'produce') {
                    return this.stage === STAGE_MATURE && this.hasProduce;
                }
                return this.stage === STAGE_MATURE; // Consume types are ready when mature
            }
        },
        {
            key: "applyGlowEffect",
            value: function applyGlowEffect() {
                var _this = this;
                var ready = this.isReadyToHarvest();
                if (ready && this.matureGlowMaterial) {
                    this.mesh.traverse(function(child) {
                        if (child.isMesh) {
                            if (!child.userData.originalMaterial) {
                                child.userData.originalMaterial = child.material;
                            }
                            child.material = _this.matureGlowMaterial;
                        }
                    });
                } else if (this.mesh) {
                    this.mesh.traverse(function(child) {
                        if (child.isMesh && child.userData.originalMaterial) {
                            child.material = child.userData.originalMaterial;
                            delete child.userData.originalMaterial;
                        }
                    });
                }
            }
        },
        {
            key: "updateWaterVisuals",
            value: function updateWaterVisuals() {
                if (!this.currentBaseMaterial) return;
                if (this.needsWatering && this.currentWaterLevel <= 0) {
                    // Very thirsty - strong visual change
                    this.currentBaseMaterial.color.setHex(0xAD8A56); // Brownish, desaturated
                    if (this.mesh) this.mesh.rotation.x = 0.15; // Noticeable droop
                } else if (this.needsWatering) {
                    // Needs water, but still has some - moderate visual change
                    var lerpFactor = Math.max(0, this.currentWaterLevel / (this.typeConfig.maxWaterLevel * 0.5)); // More pronounced as it gets lower
                    var thirstyColor = new THREE.Color(0xBFA47C); // Lighter brownish
                    this.currentBaseMaterial.color.lerpColors(thirstyColor, this.originalColor, lerpFactor);
                    if (this.mesh) this.mesh.rotation.x = 0.075; // Slight droop
                } else {
                    // Healthy
                    this.currentBaseMaterial.color.set(this.originalColor);
                    if (this.mesh) this.mesh.rotation.x = 0; // Upright
                }
            }
        },
        {
            key: "waterPlant",
            value: function waterPlant() {
                this.currentWaterLevel = this.typeConfig.maxWaterLevel;
                this.needsWatering = false;
                this.isGrowthPausedByWater = false;
                this.waterTimer = this.typeConfig.waterInterval; // Reset timer for next watering
                this.updateWaterVisuals();
            // console.log(`${this.typeConfig.name} watered! Water level: ${this.currentWaterLevel}`);
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                // Water logic
                if (!this.needsWatering) {
                    this.waterTimer -= deltaTime;
                    if (this.waterTimer <= 0) {
                        this.needsWatering = true;
                        this.waterTimer = this.typeConfig.waterInterval; // Reset for next cycle, effectively ignored while needsWatering is true
                        // console.log(`${this.typeConfig.name} now needs watering.`);
                        this.updateWaterVisuals();
                    }
                } else {
                    if (this.currentWaterLevel > 0) {
                        this.currentWaterLevel -= (this.typeConfig.waterDepletionRate || 1) * deltaTime;
                        this.currentWaterLevel = Math.max(0, this.currentWaterLevel);
                        this.updateWaterVisuals();
                    }
                    if (this.currentWaterLevel <= 0 && !this.isGrowthPausedByWater) {
                        this.isGrowthPausedByWater = true;
                        // console.log(`${this.typeConfig.name} growth paused due to lack of water.`);
                        this.updateWaterVisuals(); // Ensure driest look
                    }
                }
                // Pause growth/production if water is depleted
                if (this.isGrowthPausedByWater && !this.isFertilizeEffectActive) {
                    return; // Skip other updates
                }
                // Fertilize effect animation
                if (this.isFertilizeEffectActive) {
                    this.fertilizeEffectTimer -= deltaTime;
                    if (this.fertilizeEffectTimer <= 0) {
                        this.isFertilizeEffectActive = false;
                        // Revert color then immediately apply water visuals to ensure correct state
                        this.currentBaseMaterial.color.set(this.preEffectMaterialColor);
                        this.updateWaterVisuals(); // This ensures thirsty look is reapplied if needed
                    }
                }
                if (this.isGrowthPausedByWater) {
                    return;
                }
                // Glow pulsation
                if (this.isReadyToHarvest() && this.matureGlowMaterial) {
                    this.matureGlowMaterial.opacity = 0.6 + Math.sin(Date.now() * 0.005) * 0.3;
                } else if (this.matureGlowMaterial) {
                    this.matureGlowMaterial.opacity = 0.7;
                }
                // Growth logic
                if (this.stage < STAGE_MATURE) {
                    this.growthTimer += deltaTime;
                    var currentStageConfig = this.typeConfig.stages[this.stage];
                    if (this.growthTimer >= currentStageConfig.duration) {
                        this.growthTimer = 0;
                        this.stage++;
                        if (this.stage > STAGE_MATURE) this.stage = STAGE_MATURE;
                        this.updateMesh();
                        if (this.stage === STAGE_MATURE && this.typeConfig.harvestType === 'produce') {
                            this.productionTimer = 0;
                            this.hasProduce = false;
                        }
                    }
                } else if (this.typeConfig.harvestType === 'produce' && !this.hasProduce) {
                    this.productionTimer += deltaTime;
                    if (this.productionTimer >= this.typeConfig.productionInterval) {
                        this.hasProduce = true;
                        this.productionTimer = 0;
                        this.applyGlowEffect();
                    }
                } else if (this.typeConfig.canSpread && this.stage === STAGE_MATURE && this.typeConfig.harvestType === 'consume') {
                    this.spreadTimer += deltaTime;
                    if (this.spreadTimer >= this.typeConfig.spreadInterval) {
                        this._wantsToSpread = true;
                        this.spreadTimer = 0;
                    }
                }
            }
        },
        {
            key: "canAttemptSpread",
            value: function canAttemptSpread() {
                var canSpread = this._wantsToSpread;
                if (canSpread) {
                    this._wantsToSpread = false; // Consume the spread attempt flag
                }
                return canSpread;
            }
        },
        {
            key: "isMature",
            value: function isMature() {
                return this.stage === STAGE_MATURE;
            }
        },
        {
            key: "collectProduce",
            value: function collectProduce() {
                if (this.typeConfig.harvestType === 'produce' && this.isReadyToHarvest()) {
                    this.hasProduce = false;
                    this.productionTimer = 0; // Reset timer for next yield
                    this.applyGlowEffect(); // Turn off glow
                    return this.typeConfig.points;
                }
                return 0;
            }
        },
        {
            key: "getPoints",
            value: function getPoints() {
                return this.typeConfig.points;
            }
        },
        {
            key: "triggerFertilizeEffect",
            value: function triggerFertilizeEffect() {
                if (!this.currentBaseMaterial) return;
                this.preEffectMaterialColor.copy(this.currentBaseMaterial.color); // Store current color
                this.currentBaseMaterial.color.setHex(FERTILIZE_EFFECT_COLOR);
                this.isFertilizeEffectActive = true;
                this.fertilizeEffectTimer = FERTILIZE_EFFECT_DURATION;
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.mesh) {
                    this.mesh.traverse(function(child) {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(function(m) {
                                    return m.dispose();
                                });
                            } else {
                                child.material.dispose();
                            }
                        }
                        if (child.userData.originalMaterial) {
                            child.userData.originalMaterial.dispose();
                        }
                    });
                }
                if (this.currentBaseMaterial) this.currentBaseMaterial.dispose();
                if (this.matureGlowMaterial) this.matureGlowMaterial.dispose();
                if (this.extraMaterials) {
                    this.extraMaterials.forEach(function(m) {
                        return m.dispose();
                    });
                }
            }
        }
    ]);
    return Plant;
}();
