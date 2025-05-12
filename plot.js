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
import { Plant } from './plant.js';
var PLOT_COLOR_EMPTY = 0x7f5539; // Brown
var PLOT_COLOR_GROWING = 0x6a422f; // Darker Brown
var PLOT_COLOR_THIRSTY = 0x9DB4C0; // Light, desaturated blue-grey for thirsty
var PLOT_COLOR_FERTILIZED = 0x556B2F; // Dark Olive Green, distinct from growing
var PLOT_HOVER_EMISSIVE = 0x333333; // Subtle emissive for hover
export var Plot = /*#__PURE__*/ function() {
    "use strict";
    function Plot(position, size) {
        _class_call_check(this, Plot);
        this.position = position;
        this.size = size;
        this.plantInstances = [];
        this.isFertilized = false; // New property for fertilizer state
        this.group = new THREE.Group();
        this.group.position.copy(position);
        var plotGeometry = new THREE.BoxGeometry(size, 0.2, size);
        this.plotMaterial = new THREE.MeshStandardMaterial({
            color: PLOT_COLOR_EMPTY,
            emissive: 0x000000
        });
        this.plotMesh = new THREE.Mesh(plotGeometry, this.plotMaterial);
        this.plotMesh.castShadow = true;
        this.plotMesh.receiveShadow = true;
        this.plotMesh.userData.plot = this;
        this.group.add(this.plotMesh);
    }
    _create_class(Plot, [
        {
            key: "isEmpty",
            value: function isEmpty() {
                return this.plantInstances.length === 0;
            }
        },
        {
            key: "isReadyToHarvest",
            value: function isReadyToHarvest() {
                return this.plantInstances.some(function(p) {
                    return p.isReadyToHarvest() && !p.isGrowthPausedByWater;
                });
            }
        },
        {
            key: "needsWatering",
            value: function needsWatering() {
                return this.plantInstances.some(function(p) {
                    return p.needsWatering;
                });
            }
        },
        {
            key: "waterPlants",
            value: function waterPlants() {
                var wateredAny = false;
                this.plantInstances.forEach(function(plant) {
                    if (plant.needsWatering) {
                        plant.waterPlant();
                        wateredAny = true;
                    }
                });
                this.updatePlotAppearance(); // Update color after watering
                return wateredAny;
            }
        },
        {
            key: "plantSeed",
            value: function plantSeed(plantTypeConfig) {
                if (!plantTypeConfig) return;
                var canPlantMultiple = plantTypeConfig.allowMultiplePerPlot;
                var maxPlants = canPlantMultiple ? plantTypeConfig.maxPlantsPerPlot : 1;
                // Additional check: if the plot is not empty and the new plant is not of the same type as existing ones (and allows multiple)
                if (!this.isEmpty() && !canPlantMultiple) return; // Can't plant a single-plant type if plot is not empty
                if (!this.isEmpty() && canPlantMultiple && this.plantInstances[0].typeConfig.name !== plantTypeConfig.name) return; // Can't mix different multi-plant types
                if (this.plantInstances.length < maxPlants) {
                    var newPlant = new Plant(plantTypeConfig, this.size);
                    if (canPlantMultiple) {
                        var plantIndex = this.plantInstances.length;
                        var offset = this.calculatePlantPosition(plantIndex, maxPlants);
                        newPlant.mesh.position.add(offset);
                    }
                    this.plantInstances.push(newPlant);
                    this.group.add(newPlant.mesh);
                    this.updatePlotAppearance();
                // console.log(`Planted ${plantTypeConfig.name}. Plot has ${this.plantInstances.length}/${maxPlants}.`);
                } else {
                // console.log(`Cannot plant ${plantTypeConfig.name}, plot is full.`);
                }
            }
        },
        {
            key: "canReceiveSpread",
            value: function canReceiveSpread(plantTypeConfig) {
                if (!plantTypeConfig) return false;
                if (this.isEmpty()) return true; // Can always plant in an empty plot
                // If not empty, check if the incoming plant type allows multiple and if there's space
                if (plantTypeConfig.allowMultiplePerPlot) {
                    // And if all existing plants are of the same type (herbs don't mix with trees on same plot)
                    var allSameType = this.plantInstances.every(function(p) {
                        return p.typeConfig.name === plantTypeConfig.name;
                    });
                    if (allSameType && this.plantInstances.length < plantTypeConfig.maxPlantsPerPlot) {
                        return true;
                    }
                }
                return false;
            }
        },
        {
            key: "calculatePlantPosition",
            value: function calculatePlantPosition(plantIndex, maxArrangementSize) {
                var offset = new THREE.Vector3();
                var s = this.size * 0.25; // Spread factor (e.g., quarter of plot size, so plants are within half plot size from center)
                if (maxArrangementSize <= 1) {
                    return offset; // Position at center (0,0,0 relative to plot group)
                }
                switch(maxArrangementSize){
                    case 2:
                        offset.x = plantIndex === 0 ? -s : s;
                        break;
                    case 3:
                        if (plantIndex === 0) offset.set(0, 0, s); // Top point
                        else if (plantIndex === 1) offset.set(-s, 0, -s * 0.6); // Bottom-left
                        else if (plantIndex === 2) offset.set(s, 0, -s * 0.6); // Bottom-right
                        break;
                    case 4:
                        offset.x = plantIndex % 2 === 0 ? -s : s;
                        offset.z = plantIndex < 2 ? -s : s;
                        break;
                    case 5:
                        if (plantIndex < 4) {
                            offset.x = plantIndex % 2 === 0 ? -s : s;
                            offset.z = plantIndex < 2 ? -s : s;
                        } else {
                            offset.set(0, 0, 0);
                        }
                        break;
                    case 6:
                        var col = plantIndex % 3; // Column: 0, 1, 2
                        var row = Math.floor(plantIndex / 3); // Row: 0, 1
                        offset.x = (col - 1) * s; // x positions: -s, 0, s
                        offset.z = row === 0 ? -s * 0.75 : s * 0.75; // z positions for two rows
                        break;
                    default:
                        // Fallback for unhandled maxArrangementSize or > 6: arrange in a circle
                        // This makes it robust if we add plants with more per plot later.
                        if (maxArrangementSize > 1) {
                            var angle = plantIndex / maxArrangementSize * Math.PI * 2;
                            var radius = s * 1.2; // Use a slightly adjusted radius for circular
                            offset.x = Math.cos(angle) * radius;
                            offset.z = Math.sin(angle) * radius;
                        }
                        break;
                }
                return offset;
            }
        },
        {
            key: "harvest",
            value: function harvest() {
                var readyPlantIndex = this.plantInstances.findIndex(function(p) {
                    return p.isReadyToHarvest();
                });
                if (readyPlantIndex === -1) return 0;
                var plantToHarvest = this.plantInstances[readyPlantIndex];
                var plantConfig = plantToHarvest.typeConfig;
                var points = 0;
                if (plantConfig.harvestType === 'produce') {
                    points = plantToHarvest.collectProduce();
                // Plant remains for 'produce' type
                } else {
                    points = plantToHarvest.getPoints();
                    this.group.remove(plantToHarvest.mesh);
                    plantToHarvest.dispose();
                    this.plantInstances.splice(readyPlantIndex, 1);
                }
                if (points > 0 && this.isFertilized) {
                    points = Math.round(points * 1.25); // 25% boost
                    this.isFertilized = false; // Consume fertilizer
                // console.log(`Fertilizer consumed. Boosted yield to ${points}`);
                }
                this.updatePlotAppearance(); // Update color after harvesting/fertilizer consumption
                // console.log(`Harvested ${plantConfig.name} for ${points} points. ${this.plantInstances.length} plants remaining.`);
                return points;
            }
        },
        {
            key: "applyFertilizer",
            value: function applyFertilizer() {
                if (!this.isEmpty() && !this.isFertilized) {
                    this.isFertilized = true;
                    this.plantInstances.forEach(function(plant) {
                        return plant.triggerFertilizeEffect();
                    });
                    this.updatePlotAppearance(); // Update plot color to fertilized color
                    // console.log(`Plot at ${this.position.x}, ${this.position.z} fertilized. Triggering effects.`);
                    return true;
                }
                return false;
            }
        },
        {
            key: "updatePlotAppearance",
            value: function updatePlotAppearance() {
                if (this.isEmpty()) {
                    this.plotMaterial.color.setHex(PLOT_COLOR_EMPTY);
                } else if (this.needsWatering()) {
                    this.plotMaterial.color.setHex(PLOT_COLOR_THIRSTY);
                } else if (this.isFertilized) {
                    this.plotMaterial.color.setHex(PLOT_COLOR_FERTILIZED);
                } else {
                    this.plotMaterial.color.setHex(PLOT_COLOR_GROWING);
                }
            }
        },
        {
            key: "update",
            value: function update(deltaTime, game) {
                var _this = this;
                var needsVisualUpdate = false;
                var previousNeedsWatering = this.needsWatering();
                this.plantInstances.forEach(function(plant) {
                    plant.update(deltaTime);
                    if (plant.typeConfig.canSpread && plant.canAttemptSpread()) {
                        game.attemptSpreadFromPlot(_this, plant.typeConfig);
                    }
                });
                // Check if water status changed to trigger a plot color update
                if (previousNeedsWatering !== this.needsWatering()) {
                    needsVisualUpdate = true;
                }
                if (needsVisualUpdate) {
                    this.updatePlotAppearance();
                }
            }
        },
        {
            key: "getClickableMesh",
            value: function getClickableMesh() {
                return this.plotMesh;
            }
        },
        {
            key: "onPointerEnter",
            value: function onPointerEnter() {
                this.plotMaterial.emissive.setHex(PLOT_HOVER_EMISSIVE);
            }
        },
        {
            key: "onPointerLeave",
            value: function onPointerLeave() {
                this.plotMaterial.emissive.setHex(0x000000); // Revert to no emissive
            }
        }
    ]);
    return Plot;
}();
