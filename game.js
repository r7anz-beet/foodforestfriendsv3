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
import { SceneSetup } from './sceneSetup.js';
import { Plot } from './plot.js';
import { InputHandler } from './inputHandler.js';
import { UI } from './ui.js';
import { PLANT_TYPES } from './plantSettings.js';
import { AudioManager } from './AudioManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { TitleScreen } from './TitleScreen.js'; // Import TitleScreen
var PLOT_SIZE = 2;
var PLOT_SPACING = 0.5;
var GRID_DIMENSION = 3; // 3x3 grid
var FERTILIZER_COST = 5; // Cost in points to apply fertilizer
var MAX_GAME_TIME = 180; // 3 minutes for the game session
var WIN_SCORE = 250; // Score needed to win
// Medal Time Goals (in seconds) - Must be achieved *before* these times if winning
var PLATINUM_TIME = 60; // Achieve win in under 1 minute
var GOLD_TIME = 90; // Achieve win in under 1.5 minutes
var SILVER_TIME = 120; // Achieve win in under 2 minutes
var BRONZE_TIME = 150; // Achieve win in under 2.5 minutes
var MAX_ENERGY = 100; // Maximum energy
var ENERGY_DRAIN_RATE = 0.25; // Energy points per second (passive drain)
var ENERGY_REGEN_RATE = 0.5; // Energy points per second (passive regen)
var REST_ENERGY_GAIN = 20; // Energy gained per rest action
var REST_POINT_COST = 10; // Points cost for resting
export var Game = /*#__PURE__*/ function() {
    "use strict";
    function Game(renderDiv) {
        _class_call_check(this, Game);
        this.renderDiv = renderDiv;
        this.sceneSetup = new SceneSetup(renderDiv);
        this.scene = this.sceneSetup.scene;
        this.camera = this.sceneSetup.camera;
        this.renderer = this.sceneSetup.renderer;
        this.audioManager = new AudioManager();
        this.particleSystem = new ParticleSystem(this.sceneSetup.scene);
        this.titleScreen = new TitleScreen(this.startGame.bind(this));
        this.isGameStarted = false;
        this.clock = new THREE.Clock();
        this.plots = [];
        this.score = 0;
        this.gameTime = 0;
        this.currentEnergy = MAX_ENERGY;
        this.isGameOver = false;
        this.selectedPlantTypeKey = Object.keys(PLANT_TYPES)[0];
        this.selectedTool = './plant.js';
        // UI and InputHandler will be initialized in startGame
        this.ui = null;
        this.inputHandler = null;
        this.gameLoop = this.gameLoop.bind(this);
    }
    _create_class(Game, [
        {
            // New method to initialize game components after title screen
            key: "initializeGameSystems",
            value: function initializeGameSystems() {
                this.ui = new UI(PLANT_TYPES, this.handlePlantSelection.bind(this), this.handleToolSelection.bind(this), FERTILIZER_COST, REST_POINT_COST);
                this.ui.updateScore(this.score);
                this.ui.updateGameTimer(this.gameTime);
                this.ui.updateEnergy(this.currentEnergy, MAX_ENERGY);
                this.ui.updateBiodiversityBonus(this.calculateBiodiversityBonus());
                this.createGarden(); // Garden creation needs plots array to be populated
                this.inputHandler = new InputHandler(this.camera, this.scene, this.plots.map(function(p) {
                    return p.getClickableMesh();
                }), this.handlePlotClick.bind(this), this.audioManager);
                this.updateUIState(); // Initial UI state based on default selections
                this.isGameStarted = true;
                this.gameLoop(); // Start the game loop only after initialization
            } // Added missing closing brace for initializeGameSystems
        },
        {
            key: "createGarden",
            value: function createGarden() {
                var totalGridSize = GRID_DIMENSION * PLOT_SIZE + (GRID_DIMENSION - 1) * PLOT_SPACING;
                var offset = -totalGridSize / 2 + PLOT_SIZE / 2;
                for(var i = 0; i < GRID_DIMENSION; i++){
                    for(var j = 0; j < GRID_DIMENSION; j++){
                        var x = offset + i * (PLOT_SIZE + PLOT_SPACING);
                        var z = offset + j * (PLOT_SIZE + PLOT_SPACING);
                        var plot = new Plot(new THREE.Vector3(x, 0, z), PLOT_SIZE); // Plots are initially empty
                        this.plots.push(plot);
                        this.scene.add(plot.group);
                    }
                }
                // Adjust camera to view the whole garden
                var gardenCenter = new THREE.Vector3(0, 0, 0); // Grid is centered at origin
                this.camera.position.set(0, 10, totalGridSize * 0.6); // Position above and slightly back
                this.camera.lookAt(gardenCenter);
                this.sceneSetup.setCameraZoom(totalGridSize * 1.2); // Zoom to fit garden
            }
        },
        {
            key: "handlePlotClick",
            value: function handlePlotClick(clickedPlotMesh) {
                var plot = this.plots.find(function(p) {
                    return p.getClickableMesh() === clickedPlotMesh;
                });
                if (!plot) return;
                if (this.selectedTool === 'water') {
                    if (plot.needsWatering()) {
                        if (plot.waterPlants()) {
                            this.audioManager.playHarvestSound(); // Re-use harvest sound for watering for now
                            this.ui.setInstructions('Watered plants on this plot.');
                        } else {
                            this.ui.setInstructions('These plants do not need watering right now.');
                        }
                    } else {
                        this.ui.setInstructions('These plants do not need watering.');
                    }
                } else if (this.selectedTool === 'fertilizer') {
                    if (!plot.isEmpty() && !plot.isFertilized) {
                        if (this.score >= FERTILIZER_COST) {
                            if (plot.applyFertilizer()) {
                                this.score -= FERTILIZER_COST;
                                this.ui.updateScore(this.score);
                                this.audioManager.playFertilizeSound();
                                this.particleSystem.createSparkleEffect(plot.group.position); // Trigger sparkle effect
                                this.ui.setInstructions("Plot fertilized for ".concat(FERTILIZER_COST, " points!"));
                            } else {
                                this.ui.setInstructions('Could not fertilize this plot.'); // Should not happen if checks pass
                            }
                        } else {
                            this.ui.setInstructions("Not enough points to fertilize. Costs ".concat(FERTILIZER_COST, "."));
                        }
                    } else if (plot.isEmpty()) {
                        this.ui.setInstructions('Cannot fertilize an empty plot.');
                    } else if (plot.isFertilized) {
                        this.ui.setInstructions('This plot is already fertilized.');
                    }
                } else if (this.selectedTool === './plant.js') {
                    if (plot.isEmpty()) {
                        var plantType = PLANT_TYPES[this.selectedPlantTypeKey];
                        var energyCost = plantType.energyCost || 0; // Default to 0 if not defined
                        if (this.currentEnergy >= energyCost) {
                            plot.plantSeed(plantType);
                            this.currentEnergy -= energyCost;
                            this.ui.updateEnergy(this.currentEnergy, MAX_ENERGY);
                            this.audioManager.playPlantSound();
                            this.ui.setInstructions("Planted ".concat(plantType.name, " for ").concat(energyCost, " energy."));
                            this.ui.updateBiodiversityBonus(this.calculateBiodiversityBonus()); // Update bonus after planting
                        } else {
                            this.ui.setInstructions("Not enough energy to plant ".concat(plantType.name, ". Needs ").concat(energyCost, ", you have ").concat(Math.floor(this.currentEnergy), "."));
                        }
                    } else if (plot.isReadyToHarvest()) {
                        var harvestedPoints = plot.harvest(); // Store initial points
                        if (harvestedPoints > 0) {
                            var biodiversityBonus = this.calculateBiodiversityBonus();
                            var bonusText = "";
                            var finalPoints = harvestedPoints;
                            if (biodiversityBonus > 1) {
                                finalPoints = Math.round(harvestedPoints * biodiversityBonus);
                                bonusText = " (x".concat(biodiversityBonus.toFixed(1), " Bonus!)");
                            }
                            this.score += finalPoints;
                            this.ui.updateScore(this.score);
                            this.audioManager.playHarvestSound();
                            this.ui.setInstructions("Harvested for ".concat(finalPoints, " points!").concat(bonusText));
                            this.ui.updateBiodiversityBonus(this.calculateBiodiversityBonus()); // Update bonus after harvest (if plant removed)
                        }
                    } else {
                        var plantName = plot.plantInstances[0] ? plot.plantInstances[0].typeConfig.name : "something";
                        this.ui.setInstructions("This plot has a ".concat(plantName, " growing. Not ready for harvest or planting over."));
                    }
                } else if (this.selectedTool === 'rest') {
                    this.performRestAction();
                }
                this.updateUIState();
            }
        },
        {
            key: "handlePlantSelection",
            value: function handlePlantSelection(plantKey) {
                this.selectedPlantTypeKey = plantKey;
                this.selectedTool = './plant.js'; // Implicitly select './plant.js' tool
                this.updateUIState();
            }
        },
        {
            key: "handleToolSelection",
            value: function handleToolSelection(toolType) {
                this.selectedTool = toolType;
                // If 'water' is selected, there's no specific plant type selected for planting purposes.
                // selectedPlantTypeKey can remain, but UI should reflect that 'water' tool is primary.
                this.updateUIState();
            }
        },
        {
            key: "updateUIState",
            value: function updateUIState() {
                var instructionText = "";
                if (this.selectedTool === 'water') {
                    instructionText = "Watering Can selected. Click a thirsty plot to water plants.";
                } else if (this.selectedTool === './plant.js') {
                    var plantName = PLANT_TYPES[this.selectedPlantTypeKey].name;
                    var energyCost = PLANT_TYPES[this.selectedPlantTypeKey].energyCost || 0;
                    instructionText = "Selected: ".concat(plantName, " (Cost: ").concat(energyCost, "⚡). Click an empty plot to plant, or a glowing plant to harvest.");
                } else if (this.selectedTool === 'fertilizer') {
                    instructionText = "Fertilizer selected. Click a planted plot to fertilize it for a yield boost.";
                } else if (this.selectedTool === 'rest') {
                    instructionText = "Resting selected. Cost: ".concat(REST_POINT_COST, " points, Gain: ").concat(REST_ENERGY_GAIN, "⚡. Click anywhere to rest.");
                }
                this.ui.setInstructions(instructionText);
                this.ui.updateSelectedButtonStates(this.selectedTool, this.selectedPlantTypeKey);
                // Update cursor based on selected tool
                if (this.selectedTool === 'water') {
                    this.renderDiv.style.cursor = 'crosshair';
                } else if (this.selectedTool === 'fertilizer') {
                    this.renderDiv.style.cursor = 'cell'; // Placeholder for a fertilizer icon
                } else if (this.selectedTool === 'rest') {
                    this.renderDiv.style.cursor = 'pointer'; // Or a more fitting cursor like 'wait'
                } else {
                    this.renderDiv.style.cursor = 'default';
                }
            }
        },
        {
            key: "update",
            value: function update() {
                var _this = this;
                if (!this.isGameStarted || this.isGameOver) return;
                var deltaTime = this.clock.getDelta();
                this.plots.forEach(function(plot) {
                    return plot.update(deltaTime, _this);
                });
                this.particleSystem.update(deltaTime);
                this.gameTime += deltaTime;
                if (this.ui) this.ui.updateGameTimer(this.gameTime);
                // Passive energy drain and regeneration
                this.currentEnergy -= ENERGY_DRAIN_RATE * deltaTime;
                this.currentEnergy += ENERGY_REGEN_RATE * deltaTime;
                this.currentEnergy = Math.max(0, Math.min(this.currentEnergy, MAX_ENERGY));
                if (this.ui) this.ui.updateEnergy(this.currentEnergy, MAX_ENERGY);
                if (this.score >= WIN_SCORE) {
                    this.gameOver(true);
                } else if (this.gameTime >= MAX_GAME_TIME) {
                    this.gameOver(false);
                }
            }
        },
        {
            key: "performRestAction",
            value: function performRestAction() {
                if (this.score >= REST_POINT_COST) {
                    if (this.currentEnergy < MAX_ENERGY) {
                        this.score -= REST_POINT_COST;
                        this.currentEnergy += REST_ENERGY_GAIN;
                        this.currentEnergy = Math.min(this.currentEnergy, MAX_ENERGY); // Don't exceed max
                        this.ui.updateScore(this.score);
                        this.ui.updateEnergy(this.currentEnergy, MAX_ENERGY);
                        this.audioManager.playHarvestSound(); // Re-use harvest sound for a positive feedback
                        this.particleSystem.createSparkleEffect(this.camera.position.clone().add(new THREE.Vector3(0, -2, -5))); // Sparkle near camera
                        this.ui.setInstructions("Rested! Gained ".concat(REST_ENERGY_GAIN, " energy for ").concat(REST_POINT_COST, " points."));
                    } else {
                        this.ui.setInstructions('Energy is already full!');
                    }
                } else {
                    this.ui.setInstructions("Not enough points to rest. Costs ".concat(REST_POINT_COST, "."));
                }
            }
        },
        {
            key: "getAdjacentPlots",
            value: function getAdjacentPlots(sourcePlot) {
                var adjacent = [];
                var DIRS = [
                    {
                        x: 1,
                        z: 0
                    },
                    {
                        x: -1,
                        z: 0
                    },
                    {
                        x: 0,
                        z: 1
                    },
                    {
                        x: 0,
                        z: -1
                    }
                ]; // N, S, E, W
                var plotStep = PLOT_SIZE + PLOT_SPACING;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    var _this, _loop = function() {
                        var dir = _step.value;
                        var targetX = sourcePlot.position.x + dir.x * plotStep;
                        var targetZ = sourcePlot.position.z + dir.z * plotStep;
                        var targetPlot = _this.plots.find(function(p) {
                            return Math.abs(p.position.x - targetX) < 0.01 && Math.abs(p.position.z - targetZ) < 0.01;
                        });
                        if (targetPlot) {
                            adjacent.push(targetPlot);
                        }
                    };
                    for(var _iterator = DIRS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_this = this, _loop();
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return adjacent;
            }
        },
        {
            key: "attemptSpreadFromPlot",
            value: function attemptSpreadFromPlot(sourcePlot, plantTypeConfig) {
                // console.log(`Attempting to spread ${plantTypeConfig.name} from plot ${sourcePlot.position.x},${sourcePlot.position.z}`);
                var adjacentPlots = this.getAdjacentPlots(sourcePlot);
                var availableAdjacentPlots = adjacentPlots.filter(function(p) {
                    return p.canReceiveSpread(plantTypeConfig);
                });
                if (availableAdjacentPlots.length > 0) {
                    // Spread to a random available adjacent plot
                    var targetPlot = availableAdjacentPlots[Math.floor(Math.random() * availableAdjacentPlots.length)];
                    targetPlot.plantSeed(plantTypeConfig);
                    this.audioManager.playPlantSound(); // Play sound for spreading
                // console.log(`Successfully spread ${plantTypeConfig.name} to plot ${targetPlot.position.x},${targetPlot.position.z}`);
                } else {
                // console.log(`No available adjacent plots for ${plantTypeConfig.name} to spread to.`);
                }
            }
        },
        {
            key: "calculateBiodiversityBonus",
            value: function calculateBiodiversityBonus() {
                var uniquePlantTypes = new Set();
                this.plots.forEach(function(plot) {
                    if (!plot.isEmpty()) {
                        // Assuming one type per plot for simplicity, or the primary type if multiple are allowed
                        // For plots allowing multiple of the SAME type, this still counts as one unique type from that plot.
                        uniquePlantTypes.add(plot.plantInstances[0].typeConfig.name);
                    }
                });
                var count = uniquePlantTypes.size;
                if (count >= 9) return 1.4;
                if (count >= 5) return 1.2;
                if (count >= 3) return 1.1;
                return 1.0; // No bonus
            }
        },
        {
            key: "render",
            value: function render() {
                this.renderer.render(this.scene, this.camera);
            }
        },
        {
            key: "gameLoop",
            value: function gameLoop() {
                if (!this.isGameStarted && !this.titleScreen.isVisible) {
                    // If game hasn't started and title screen isn't showing, show title screen
                    this.titleScreen.show();
                }
                // The actual game update and render only happen if isGameStarted is true
                if (this.isGameStarted) {
                    this.update();
                }
                this.render(); // Always render the scene (might show title screen overlay)
                requestAnimationFrame(this.gameLoop);
            }
        },
        {
            key: "gameOver",
            value: function gameOver(didWin) {
                if (this.isGameOver) return; // Prevent multiple calls
                this.isGameOver = true;
                var achievedMedals = [];
                var bestAchievedMedalValue = 0; // 4: Platinum, 3: Gold, 2: Silver, 1: Bronze, 0: None
                if (didWin) {
                    if (this.gameTime < PLATINUM_TIME) {
                        achievedMedals.push('Platinum');
                        bestAchievedMedalValue = Math.max(bestAchievedMedalValue, 4);
                    }
                    if (this.gameTime < GOLD_TIME) {
                        achievedMedals.push('Gold');
                        bestAchievedMedalValue = Math.max(bestAchievedMedalValue, 3);
                    }
                    if (this.gameTime < SILVER_TIME) {
                        achievedMedals.push('Silver');
                        bestAchievedMedalValue = Math.max(bestAchievedMedalValue, 2);
                    }
                    if (this.gameTime < BRONZE_TIME) {
                        achievedMedals.push('Bronze');
                        bestAchievedMedalValue = Math.max(bestAchievedMedalValue, 1);
                    }
                    // Personal Best Logic
                    var currentBestMedalValue = parseInt(localStorage.getItem('bestMedalValue') || '0');
                    if (bestAchievedMedalValue > currentBestMedalValue) {
                        localStorage.setItem('bestMedalValue', bestAchievedMedalValue.toString());
                        // Trigger a special particle effect for new PB
                        // We'll use the camera's current view as a focal point for the celebration
                        var effectPosition = this.camera.position.clone().add(new THREE.Vector3(0, -1, -5).applyQuaternion(this.camera.quaternion));
                        this.particleSystem.createMedalAchievedEffect(effectPosition, achievedMedals[0]); // Pass the best medal achieved
                        this.audioManager.playWinSound(); // Play a distinct win sound
                    }
                }
                this.ui.showGameOverMessage(this.score, didWin, WIN_SCORE, MAX_GAME_TIME, this.gameTime, achievedMedals);
                if (this.inputHandler) {
                    this.inputHandler.disable();
                }
                this.renderDiv.style.cursor = 'default';
                if (didWin) {
                    console.log("You Won! Final Score: ".concat(this.score, ", Time: ").concat(this.gameTime.toFixed(2), "s. Medals: ").concat(achievedMedals.join(', ')));
                } else {
                    console.log("Game Over! Time's up. Final Score: ".concat(this.score));
                }
            }
        },
        {
            key: "startGame",
            value: function startGame() {
                if (this.isGameStarted) return; // Prevent starting multiple times
                this.titleScreen.hide();
                this.titleScreen.destroy(); // Clean up title screen DOM elements
                this.titleScreen = null; // Release reference
                this.initializeGameSystems();
            // gameLoop is already requested by 'start' method, and will pick up isGameStarted flag
            }
        },
        {
            // This method is called externally (e.g., from main.js) to kick things off
            key: "start",
            value: function start() {
                this.titleScreen.show();
                this.gameLoop(); // Start the loop, which will initially just show title screen
            }
        }
    ]);
    return Game;
}();
