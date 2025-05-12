function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
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
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
export var UI = /*#__PURE__*/ function() {
    "use strict";
    function UI(plantTypes, onPlantSelectCallback, onToolSelectCallback, fertilizerCost, restCost) {
        _class_call_check(this, UI);
        this.plantTypes = plantTypes;
        this.onPlantSelectCallback = onPlantSelectCallback;
        this.onToolSelectCallback = onToolSelectCallback;
        this.fertilizerCost = fertilizerCost;
        this.restCost = restCost; // Store rest cost
        this.plantSelectorButtons = {};
        this.toolButtons = {}; // For tools like watering can
        this.scoreElement = this.createDOMElement('score', 'Score: 0');
        this.instructionsElement = this.createDOMElement('instructions', 'Loading...');
        this.toolsContainer = this.createDOMElement('tools-container', '');
        this.plantSelectorContainer = this.createDOMElement('plant-selector-container', '');
        this.timerElement = this.createDOMElement('timer', 'Time: 00:00');
        this.energyElement = this.createDOMElement('energy', 'Energy: 100/100'); // New energy element
        this.biodiversityBonusElement = this.createDOMElement('biodiversity-bonus', ''); // New element for bonus
        this.menuToggleButton = null;
        this.isMenuOpen = false;
        this.guideButton = null;
        this.guidePanel = null;
        this.isGuideOpen = false;
        this.resetButton = null;
        document.body.appendChild(this.scoreElement);
        document.body.appendChild(this.instructionsElement);
        document.body.appendChild(this.timerElement);
        document.body.appendChild(this.energyElement); // Add energy to body
        document.body.appendChild(this.biodiversityBonusElement); // Add bonus element to body
        document.body.appendChild(this.toolsContainer);
        document.body.appendChild(this.plantSelectorContainer);
        this.createToolSelector();
        this.createPlantSelector();
        this.createGuideButtonAndPanel();
        this.resetButton = this.createDOMElement('reset-button', '🔄 Reset Game', 'button');
        this.resetButton.addEventListener('click', function() {
            // Directly reload the page to reset the game
            window.location.reload();
        });
        document.body.appendChild(this.resetButton);
        this.applyStyles();
        this.lastEnergyPulseTime = 0; // For pulsing animation
        this.isPulsing = false;
    }
    _create_class(UI, [
        {
            key: "createDOMElement",
            value: function createDOMElement(id, textContent) {
                var elementType = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 'div';
                var element = document.createElement(elementType);
                element.id = id;
                if (textContent) element.textContent = textContent;
                return element;
            }
        },
        {
            key: "applyStyles",
            value: function applyStyles() {
                var _this = this;
                // General styles for all elements first
                var allUIContainers = [
                    this.scoreElement,
                    this.instructionsElement,
                    this.timerElement,
                    this.energyElement,
                    this.biodiversityBonusElement,
                    this.toolsContainer,
                    this.plantSelectorContainer,
                    this.guideButton,
                    this.guidePanel,
                    this.resetButton
                ];
                allUIContainers.forEach(function(el) {
                    if (!el) return;
                    el.style.position = 'absolute';
                    el.style.zIndex = '100';
                    el.style.fontFamily = 'Arial, sans-serif';
                    el.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    el.style.color = 'white';
                    el.style.padding = '10px';
                    el.style.borderRadius = '8px';
                    el.style.boxSizing = 'border-box'; // Important for width calculations
                });
                // Score styling
                this.scoreElement.style.top = '10px';
                this.scoreElement.style.left = '10px';
                this.scoreElement.style.padding = '10px 15px'; // Keep specific padding
                this.scoreElement.style.fontSize = '20px';
                this.scoreElement.style.top = '20px';
                this.scoreElement.style.left = '20px';
                this.scoreElement.style.padding = '10px 15px';
                this.scoreElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                this.scoreElement.style.color = 'white';
                this.scoreElement.style.fontFamily = 'Arial, sans-serif';
                this.scoreElement.style.fontSize = '20px';
                // Timer styling (similar to score)
                this.timerElement.style.top = 'calc(20px + ' + this.scoreElement.offsetHeight + 'px + 10px)'; // Position below score
                this.timerElement.style.left = '20px'; // Position top-left, below score
                this.timerElement.style.padding = '10px 15px';
                this.timerElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                this.timerElement.style.color = 'white';
                this.timerElement.style.fontFamily = 'Arial, sans-serif';
                this.timerElement.style.fontSize = '20px';
                // Energy Bar Styling
                this.energyElement.style.top = 'calc(20px + ' + this.scoreElement.offsetHeight + 'px + 10px + ' + this.timerElement.offsetHeight + 'px + 10px)'; // Below timer
                this.energyElement.style.left = '20px';
                this.energyElement.style.padding = '10px 15px';
                this.energyElement.style.backgroundColor = 'rgba(50, 50, 150, 0.7)'; // A blueish color for energy
                this.energyElement.style.color = 'white';
                this.energyElement.style.fontFamily = 'Arial, sans-serif';
                this.energyElement.style.fontSize = '18px';
                this.energyElement.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out'; // For pulsing
                // Biodiversity Bonus Styling
                this.biodiversityBonusElement.style.top = 'calc(20px + ' + this.scoreElement.offsetHeight + 'px + 10px + ' + this.timerElement.offsetHeight + 'px + 10px + ' + this.energyElement.offsetHeight + 'px + 10px)'; // Below energy
                this.biodiversityBonusElement.style.left = '20px';
                this.biodiversityBonusElement.style.padding = '8px 12px';
                this.biodiversityBonusElement.style.backgroundColor = 'rgba(30, 130, 76, 0.7)'; // A green color for bonus
                this.biodiversityBonusElement.style.color = 'white';
                this.biodiversityBonusElement.style.fontFamily = 'Arial, sans-serif';
                this.biodiversityBonusElement.style.fontSize = '16px';
                this.biodiversityBonusElement.style.display = 'none'; // Hidden by default
                // Instructions styling
                this.instructionsElement.style.bottom = '10px';
                this.instructionsElement.style.left = '10px';
                this.instructionsElement.style.right = '10px'; // Span width on mobile
                this.instructionsElement.style.transform = 'translateX(0)'; // Reset transform
                this.instructionsElement.style.textAlign = 'center';
                this.instructionsElement.style.fontSize = '14px';
                // Plant Selector Styling
                // No changes needed here for plant selector positioning relative to timer as it's on the right
                this.plantSelectorContainer.style.top = '20px'; // Position below score
                this.plantSelectorContainer.style.right = '20px'; // Keep on the right side
                this.plantSelectorContainer.style.display = 'flex';
                this.plantSelectorContainer.style.flexDirection = 'column';
                this.plantSelectorContainer.style.gap = '5px'; // Tighter gap for vertical stacking
                // Tools Container Styling
                // Now tools container should be below the energy bar on the left
                var toolsTopOffset = 'calc(20px'; // Start with base padding
                if (this.scoreElement) toolsTopOffset += " + ".concat(this.scoreElement.offsetHeight, "px + 10px");
                if (this.timerElement) toolsTopOffset += " + ".concat(this.timerElement.offsetHeight, "px + 10px");
                if (this.energyElement) toolsTopOffset += " + ".concat(this.energyElement.offsetHeight, "px + 10px");
                if (this.biodiversityBonusElement && this.biodiversityBonusElement.style.display !== 'none') {
                    toolsTopOffset += " + ".concat(Number(this.biodiversityBonusElement.offsetHeight) || 0, "px + 10px");
                }
                toolsTopOffset += ')';
                this.toolsContainer.style.top = toolsTopOffset;
                this.toolsContainer.style.left = '20px';
                this.toolsContainer.style.display = 'flex';
                this.toolsContainer.style.flexDirection = 'column';
                this.toolsContainer.style.gap = '5px';
                // Button Styling (applied to all buttons within these containers)
                var allButtonElements = _to_consumable_array(Object.values(this.plantSelectorButtons)).concat(_to_consumable_array(Object.values(this.toolButtons)));
                allButtonElements.forEach(function(button) {
                    if (!button) return; // Ensure button exists
                    button.style.padding = '8px 10px';
                    button.style.backgroundColor = '#f0f0f0';
                    button.style.color = '#333';
                    button.style.border = '1px solid #ccc';
                    button.style.borderRadius = '5px';
                    button.style.cursor = 'pointer';
                    button.style.fontSize = '14px';
                    button.style.minWidth = '120px';
                    button.style.textAlign = 'left'; // Align icon and text better
                    button.style.display = 'flex'; // For icon alignment
                    button.style.alignItems = 'center';
                    button.style.gap = '5px'; // Space between icon and text
                });
                // Hamburger Menu Button (created here, styled in CSS) & Guide Button
                this.menuToggleButton = this.createDOMElement('menu-toggle-button', '☰', 'button');
                this.menuToggleButton.addEventListener('click', function() {
                    return _this.toggleMenu();
                });
                document.body.appendChild(this.menuToggleButton);
                // Guide Button Styling & Reset Button Styling (Desktop)
                var guideButtonEffectiveBottom = '60px';
                var guideButtonApproxHeight = '40px';
                var generalSpacing = '10px';
                if (this.guideButton) {
                    this.guideButton.style.left = '20px';
                    this.guideButton.style.bottom = guideButtonEffectiveBottom;
                    this.guideButton.style.padding = '8px 12px';
                    this.guideButton.style.fontSize = '20px';
                    this.guideButton.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    this.guideButton.style.color = 'white';
                    this.guideButton.style.border = '1px solid #555';
                    this.guideButton.style.borderRadius = '5px';
                    this.guideButton.style.cursor = 'pointer';
                    this.guideButton.style.zIndex = '1001';
                }
                if (this.resetButton) {
                    this.resetButton.style.left = '20px';
                    this.resetButton.style.bottom = "calc(".concat(guideButtonEffectiveBottom, " + ").concat(guideButtonApproxHeight, " + ").concat(generalSpacing, ")"); // Positioned above guide button
                    this.resetButton.style.padding = '8px 12px';
                    this.resetButton.style.fontSize = '16px';
                    this.resetButton.style.backgroundColor = 'rgba(220, 50, 50, 0.8)';
                    this.resetButton.style.color = 'white';
                    this.resetButton.style.border = '1px solid #8B0000';
                    this.resetButton.style.borderRadius = '5px';
                    this.resetButton.style.cursor = 'pointer';
                    this.resetButton.style.zIndex = '1001';
                }
                // Guide Panel Styling
                if (this.guidePanel) {
                    this.guidePanel.style.position = 'fixed';
                    this.guidePanel.style.top = '50%';
                    this.guidePanel.style.left = '50%';
                    this.guidePanel.style.transform = 'translate(-50%, -50%)';
                    this.guidePanel.style.width = '80%';
                    this.guidePanel.style.maxWidth = '600px';
                    this.guidePanel.style.maxHeight = '80vh';
                    this.guidePanel.style.backgroundColor = 'rgba(20, 20, 20, 0.95)';
                    this.guidePanel.style.color = 'white';
                    this.guidePanel.style.padding = '20px';
                    this.guidePanel.style.borderRadius = '10px';
                    this.guidePanel.style.zIndex = '1005'; // Above everything
                    this.guidePanel.style.display = 'none'; // Hidden by default
                    this.guidePanel.style.overflowY = 'auto';
                    this.guidePanel.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
                    this.guidePanel.innerHTML = '\n                <h2 style="text-align: center; margin-top: 0; color: #61dafb;">Advanced Garden Guide</h2>\n                <p>Welcome, Gardener! Your goal is to cultivate a thriving garden, reach the <strong>target score</strong> before time expires, and achieve prestigious medals for your efficiency!</p>\n                <h3>\uD83C\uDFC5 Medals & Timing</h3>\n                <p>The faster you reach the win score, the better your medal:</p>\n                <ul>\n                    <li><strong>Platinum:</strong> Win in under 60 seconds.</li>\n                    <li><strong>Gold:</strong> Win in under 90 seconds.</li>\n                    <li><strong>Silver:</strong> Win in under 120 seconds.</li>\n                    <li><strong>Bronze:</strong> Win in under 150 seconds.</li>\n                </ul>\n                <p><em>Tip: Achieving a new personal best medal will trigger a special celebration!</em></p>\n                <h3>\uD83C\uDF31 Planting & Harvesting</h3>\n                <ol>\n                    <li><strong>Select Plant:</strong> Choose a plant from the right-hand menu (or top menu on mobile). Each plant has an energy cost (⚡) displayed.</li>\n                    <li><strong>Planting:</strong> Click an empty, tilled plot to plant your selected seed. Energy will be deducted.</li>\n                    <li><strong>Growth Stages:</strong> Plants mature through several stages (seedling, sprout, mature). This takes time.</li>\n                    <li><strong>Harvesting:</strong>\n                        <ul>\n                            <li><strong>Produce Plants (e.g., Berries, Trees):</strong> When mature, these plants will periodically produce fruit/nuts and start glowing. Click the glowing plant to harvest its yield for points. The plant remains.</li>\n                            <li><strong>Consume Plants (e.g., Sunflowers, Herbs):</strong> When mature, these plants will glow. Click to harvest them for points. The plant is removed from the plot.</li>\n                            <li><strong>Spreading Plants (e.g., Clover, Mint):</strong> These \'consume\' type plants can also spread to adjacent empty or compatible plots once mature.</li>\n                        </ul>\n                    </li>\n                    <li><strong>Biodiversity Bonus:</strong> Planting different types of plants can yield a score bonus when harvesting! See the "Biodiversity Bonus" section below for details.</li>\n                </ol>\n                <h3>\uD83D\uDCA7 Water & Thirst</h3>\n                <ul>\n                    <li>Plants consume water over time. When a plot\'s soil turns a <strong>light, desaturated blue-grey color</strong>, its plants are thirsty.</li>\n                    <li>Select the <strong>Watering Can</strong> tool.</li>\n                    <li>Click a thirsty plot to water all plants on it.</li>\n                    <li><strong>Consequences:</strong> If plants remain thirsty for too long, their water level drops to zero, pausing their growth and production until watered. Their appearance will change to indicate severe thirst (e.g., wilting, brownish color).</li>\n                </ul>\n                <h3>✨ Fertilizer</h3>\n                <ul>\n                    <li>Select the <strong>Fertilizer</strong> tool. This costs points to use (check tool button).</li>\n                    <li>Click a plot that already has plants to apply fertilizer. The plot will turn a <strong>dark olive green</strong>.</li>\n                    <li><strong>Benefit:</strong> The next harvest from a fertilized plant on that plot will yield <strong>25% more points</strong>! Fertilizer is consumed after one boosted harvest.</li>\n                    <li>A sparkle effect will appear when fertilizer is applied.</li>\n                </ul>\n                <h3>⚡ Energy Management</h3>\n                <ul>\n                    <li>Energy (⚡) is crucial for most actions. It\'s displayed in the top-left UI.</li>\n                    <li><strong>Costs:</strong> Planting seeds, and some future actions, will consume energy.</li>\n                    <li><strong>Passive Drain:</strong> Energy slowly depletes over time.</li>\n                    <li><strong>Passive Regen:</strong> Energy also slowly regenerates over time.</li>\n                    <li><strong>Resting:</strong>\n                        <ul>\n                            <li>Select the <strong>Rest</strong> tool.</li>\n                            <li>This action costs points (see tool button) but instantly restores a significant amount of energy.</li>\n                            <li>Useful when you\'re low on energy but have points to spare.</li>\n                        </ul>\n                    </li>\n                    <li><em>Tip: If energy hits zero, you won\'t be able to plant until it regenerates or you rest!</em></li>\n                </ul>\n                <h3>\uD83C\uDF3F Biodiversity Bonus</h3>\n                 <ul>\n                    <li>Having a variety of unique plant types growing in your garden at the same time provides a score multiplier when harvesting <em>any</em> plant.</li>\n                    <li><strong>3 Unique Plant Types:</strong> 1.1x score bonus (10% extra).</li>\n                    <li><strong>5 Unique Plant Types:</strong> 1.2x score bonus (20% extra).</li>\n                    <li><strong>9 Unique Plant Types:</strong> 1.4x score bonus (40% extra).</li>\n                    <li><em>Tip: Strategically plant different species to maximize this bonus! The bonus is checked at the moment of harvest.</em></li>\n                </ul>\n                <h3>\uD83C\uDF3F Plant Types Overview</h3>\n                <ul>\n                    <li><strong>Produce Plants:</strong> Lower initial point yield per harvest, but continue to produce over time. Good for sustained income. (e.g., Strawberry, Hazelnut)</li>\n                    <li><strong>Consume Plants:</strong> Higher one-time point yield upon harvest, but the plant is removed. Good for quick point boosts. (e.g., Sunflower)</li>\n                    <li><strong>Spreading Plants:</strong> Typically \'consume\' types that can also spread to nearby plots automatically, helping fill your garden. Often lower point values but cover area. (e.g., Calendula, Mint, Clover)</li>\n                    <li>Pay attention to <strong>energy costs</strong>, <strong>growth times</strong>, and <strong>water needs</strong> for each plant.</li>\n                </ul>\n                <h3>\uD83D\uDEE0️ Tools</h3>\n                <ul>\n                    <li><strong>Plant Selector (Implicit):</strong> When you select a plant from the menu, you\'re effectively in "plant mode".</li>\n                    <li><strong>Watering Can:</strong> Waters thirsty plants.</li>\n                    <li><strong>Fertilizer:</strong> Boosts next harvest yield for a point cost.</li>\n                    <li><strong>Rest:</strong> Costs points to regain a chunk of energy.</li>\n                </ul>\n                <h3>\uD83D\uDCF1 Mobile Users</h3>\n                <p>On smaller screens, the plant and tool selectors are combined into a <strong>hamburger menu (☰)</strong>. Tap it to open/close the selection panel. The Game Guide can be accessed via the <strong>question mark (❓)</strong> button.</p>\n                <h3>\uD83D\uDCA1 General Tips</h3>\n                <ul>\n                    <li>Balance high-yield plants with quick-growing or spreading ones.</li>\n                    <li>Don\'t let your plants stay thirsty for too long!</li>\n                    <li>Use fertilizer strategically on high-value plants just before they are ready to harvest.</li>\n                    <li>Manage your energy! Resting can be vital if you over-plant.</li>\n                    <li>Early game, focus on getting a few plants established. Mid-game, expand and optimize. Late-game, push for those last few points!</li>\n                </ul>\n                <p style="text-align:center; margin-top: 30px;"><button id="close-guide-button" style="padding: 12px 25px; font-size: 18px; cursor: pointer; background-color: #f44336; color: white; border: none; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">Close Guide</button></p>\n            ';
                }
                // Media Query for smaller screens & Hamburger Menu Logic
                var styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.innerText = "\n            #menu-toggle-button {\n                display: none; /* Hidden by default */\n                position: fixed; /* Keep it visible on scroll */\n                top: 10px;\n                right: 10px;\n                z-index: 1001; /* Above other UI */\n                padding: 8px 12px;\n                font-size: 24px;\n                background-color: rgba(0,0,0,0.7);\n                color: white;\n                border: 1px solid #555;\n                border-radius: 5px;\n                cursor: pointer;\n            }\n             #guide-button { /* Default state for guide button */\n                display: block; /* Visible by default */\n            }\n            @media (max-width: 700px) {\n                #menu-toggle-button {\n                    display: block; /* Show hamburger on small screens */\n                }\n                #guide-button { \n                    bottom: 20px; /* Fixed from screen bottom on mobile */\n                    left: 10px;\n                    top: auto; \n                    right: auto; \n                }\n                #reset-button { /* Mobile positioning for reset button */\n                    display: block;\n                    position: absolute; /* Handled by allUIContainers loop, but being explicit */\n                    bottom: calc(20px + 40px + 10px); /* Above guide button: guide_bottom + guide_height + spacing */\n                    left: 10px;\n                    /* Visual styles are set by JS, or could be defined here too if preferred */\n                    z-index: 1001;\n                }\n                #plant-selector-container, #tools-container {\n                    display: none; /* Hide selectors by default on small screens */\n                    position: fixed; /* Take over screen when open */\n                    top: 0; left: 0; right: 0; bottom: 0;\n                    width: 100%; height: 100%;\n                    background-color: rgba(0, 0, 0, 0.9); /* Dark overlay */\n                    flex-direction: column;\n                    align-items: center;\n                    justify-content: center;\n                    padding-top: 60px; /* Space for toggle button */\n                    gap: 15px;\n                    overflow-y: auto; /* Scroll if many items */\n                }\n                /* Styles for when menu is open */\n                body.menu-open #plant-selector-container,\n                body.menu-open #tools-container {\n                    display: flex; \n                }\n                /* Individual buttons within the open menu */\n                body.menu-open #plant-selector-container button,\n                body.menu-open #tools-container button {\n                    width: 80%;\n                    max-width: 300px;\n                    padding: 15px;\n                    font-size: 18px;\n                    justify-content: center;\n                }\n                /* Keep score and instructions visible but manage layout */\n                #score {\n                    position: relative; /* Allow flow */\n                    top: auto; left: auto;\n                    width: calc(100% - 20px);\n                    margin: 10px auto;\n                    text-align: center;\n                    z-index: 99; /* Below menu but above game */\n                }\n                #timer { /* Style timer for mobile menu context if needed */\n                    position: relative; /* Allow flow */\n                    top: auto; right: auto;\n                    width: calc(100% - 20px);\n                    margin: 10px auto;\n                    text-align: center;\n                    z-index: 99;\n                }\n                #energy, #biodiversity-bonus { /* Style energy and bonus for mobile menu context */\n                    position: relative;\n                    top: auto; left: auto;\n                    width: calc(100% - 20px);\n                    margin: 10px auto;\n                    text-align: center;\n                    z-index: 99;\n                }\n                #biodiversity-bonus { /* Specific style for bonus in mobile menu */\n                    font-size: 16px; /* Ensure it's readable */\n                    padding: 8px 10px;\n                 }\n                #instructions {\n                    position: fixed; /* Fixed at bottom */\n                    bottom: 10px; left: 10px; right: 10px;\n                    width: auto;\n                    margin: 0;\n                    padding-bottom: 130px; /* Increased padding for guide and reset buttons */\n                    z-index: 99;\n                }\n                 /* Make plant and tool selectors appear one after other in open menu */\n                body.menu-open #plant-selector-container { order: 5; } \n                body.menu-open #tools-container { order: 4; } \n                body.menu-open #biodiversity-bonus { order: 3; } /* Bonus after energy */\n                body.menu-open #energy { order: 2; } /* Energy after timer */\n                body.menu-open #timer { order: 1; } /* Timer after score */\n            }\n        ";
                document.head.appendChild(styleSheet);
            }
        },
        {
            key: "createGuideButtonAndPanel",
            value: function createGuideButtonAndPanel() {
                var _this = this;
                this.guideButton = this.createDOMElement('guide-button', '❓', 'button');
                this.guideButton.addEventListener('click', function() {
                    return _this.toggleGuide();
                });
                document.body.appendChild(this.guideButton);
                this.guidePanel = this.createDOMElement('guide-panel', ''); // Content set in applyStyles
                document.body.appendChild(this.guidePanel);
            // The close button inside the panel will be set up via applyStyles innerHTML
            }
        },
        {
            key: "toggleGuide",
            value: function toggleGuide() {
                var _this = this;
                var forceClose = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                this.isGuideOpen = forceClose ? false : !this.isGuideOpen;
                if (this.guidePanel) {
                    this.guidePanel.style.display = this.isGuideOpen ? 'block' : 'none';
                    if (this.isGuideOpen) {
                        // Add event listener for close button inside the panel
                        var closeButton = this.guidePanel.querySelector('#close-guide-button');
                        if (closeButton) {
                            // Remove existing listener to prevent duplicates if panel is re-shown
                            closeButton.removeEventListener('click', this.boundCloseGuide);
                            this.boundCloseGuide = function() {
                                return _this.toggleGuide(true);
                            }; // Bind 'this' context
                            closeButton.addEventListener('click', this.boundCloseGuide);
                        }
                    }
                }
                // If guide opens, ensure menu is closed (and vice-versa, though less critical)
                if (this.isGuideOpen && this.isMenuOpen) {
                    this.toggleMenu(true); // Force close menu
                }
            }
        },
        {
            key: "toggleMenu",
            value: function toggleMenu() {
                var forceClose = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                this.isMenuOpen = forceClose ? false : !this.isMenuOpen;
                document.body.classList.toggle('menu-open', this.isMenuOpen);
                this.menuToggleButton.textContent = this.isMenuOpen ? '✕' : '☰';
                if (this.isMenuOpen) {
                    this.scoreElement.style.zIndex = '99';
                    this.instructionsElement.style.zIndex = '99';
                    this.timerElement.style.zIndex = '99';
                    this.energyElement.style.zIndex = '99';
                    this.biodiversityBonusElement.style.zIndex = '99';
                    if (this.isGuideOpen) {
                        this.toggleGuide(true);
                    }
                } else {
                    this.scoreElement.style.zIndex = '100';
                    this.instructionsElement.style.zIndex = '100';
                    this.timerElement.style.zIndex = '100';
                    this.energyElement.style.zIndex = '100';
                    this.biodiversityBonusElement.style.zIndex = '100';
                }
            }
        },
        {
            key: "createToolSelector",
            value: function createToolSelector() {
                var _this = this;
                var waterToolButton = this.createDOMElement('tool-button-water', 'Watering Can');
                waterToolButton.addEventListener('click', function() {
                    return _this.onToolSelectCallback('water');
                });
                this.toolsContainer.appendChild(waterToolButton);
                this.toolButtons['water'] = waterToolButton;
                var fertilizerButtonText = "Fertilizer (".concat(this.fertilizerCost, " pts)");
                var fertilizerToolButton = this.createDOMElement('tool-button-fertilizer', fertilizerButtonText);
                fertilizerToolButton.addEventListener('click', function() {
                    return _this.onToolSelectCallback('fertilizer');
                });
                this.toolsContainer.appendChild(fertilizerToolButton);
                this.toolButtons['fertilizer'] = fertilizerToolButton;
                var restButtonText = "Rest (".concat(this.restCost, " pts)");
                var restToolButton = this.createDOMElement('tool-button-rest', restButtonText);
                restToolButton.addEventListener('click', function() {
                    return _this.onToolSelectCallback('rest');
                });
                this.toolsContainer.appendChild(restToolButton);
                this.toolButtons['rest'] = restToolButton;
            }
        },
        {
            key: "createPlantSelector",
            value: function createPlantSelector() {
                var _this, _loop = function(key) {
                    var plant = _this.plantTypes[key];
                    var energyCostText = plant.energyCost !== undefined ? " (".concat(plant.energyCost, "⚡)") : '';
                    var buttonText = "".concat(plant.icon || '🌱', " ").concat(plant.name).concat(energyCostText);
                    var button = _this.createDOMElement("plant-button-".concat(key), buttonText);
                    button.addEventListener('click', function() {
                        return _this1.onPlantSelectCallback(key);
                    });
                    _this.plantSelectorContainer.appendChild(button);
                    _this.plantSelectorButtons[key] = button;
                };
                var _this1 = this;
                for(var key in this.plantTypes)_this = this, _loop(key);
            }
        },
        {
            key: "updateSelectedButtonStates",
            value: function updateSelectedButtonStates(activeToolKey, activePlantKey) {
                // Update tool buttons
                for(var key in this.toolButtons){
                    var button = this.toolButtons[key];
                    if (key === activeToolKey) {
                        button.style.backgroundColor = '#007BFF'; // Blue for selected tool
                        button.style.color = 'white';
                        button.style.borderColor = '#0056b3';
                    } else {
                        button.style.backgroundColor = '#f0f0f0';
                        button.style.color = '#333';
                        button.style.borderColor = '#ccc';
                    }
                }
                // Update plant selector buttons
                // If a tool (like water) is active, no plant should be highlighted as "active for planting"
                var isPlantToolActive = activeToolKey === './plant.js';
                for(var key1 in this.plantSelectorButtons){
                    var button1 = this.plantSelectorButtons[key1];
                    if (isPlantToolActive && key1 === activePlantKey) {
                        button1.style.backgroundColor = '#4CAF50'; // Green for selected plant
                        button1.style.color = 'white';
                        button1.style.borderColor = '#388E3C';
                    } else {
                        button1.style.backgroundColor = '#f0f0f0';
                        button1.style.color = '#333';
                        button1.style.borderColor = '#ccc';
                    }
                }
            }
        },
        {
            key: "updateScore",
            value: function updateScore(score) {
                this.scoreElement.textContent = "Score: ".concat(score);
            }
        },
        {
            key: "setInstructions",
            value: function setInstructions(text) {
                this.instructionsElement.textContent = text;
            }
        },
        {
            key: "updateGameTimer",
            value: function updateGameTimer(totalSeconds) {
                var minutes = Math.floor(totalSeconds / 60);
                var seconds = Math.floor(totalSeconds % 60);
                this.timerElement.textContent = "Time: ".concat(String(minutes).padStart(2, '0'), ":").concat(String(seconds).padStart(2, '0'));
            }
        },
        {
            key: "updateEnergy",
            value: function updateEnergy(currentEnergy, maxEnergy) {
                var _this = this;
                if (!this.energyElement) return;
                var prevEnergy = parseFloat(this.energyElement.dataset.energyValue) || 0;
                this.energyElement.textContent = "Energy: ".concat(Math.floor(currentEnergy), " / ").concat(maxEnergy);
                this.energyElement.dataset.energyValue = currentEnergy;
                // Pulse effect when energy increases (and not from resting, which has its own particle effect)
                // and not already at max energy before this update.
                if (currentEnergy > prevEnergy && currentEnergy < maxEnergy && !this.isPulsing) {
                    this.isPulsing = true;
                    this.energyElement.style.transform = 'scale(1.05)';
                    this.energyElement.style.boxShadow = '0 0 10px rgba(173, 216, 230, 0.7)'; // Light blue glow
                    setTimeout(function() {
                        _this.energyElement.style.transform = 'scale(1)';
                        _this.energyElement.style.boxShadow = 'none';
                        _this.isPulsing = false;
                    }, 200); // Duration of the pulse effect
                }
            }
        },
        {
            key: "updateBiodiversityBonus",
            value: function updateBiodiversityBonus(bonusMultiplier) {
                if (!this.biodiversityBonusElement) return;
                if (bonusMultiplier > 1.0) {
                    this.biodiversityBonusElement.textContent = "Diversity Bonus: x".concat(bonusMultiplier.toFixed(1));
                    this.biodiversityBonusElement.style.display = 'block';
                } else {
                    this.biodiversityBonusElement.style.display = 'none';
                }
                this.applyStyles(); // Re-apply styles to adjust layout if bonus becomes visible/hidden
            }
        },
        {
            key: "showGameOverMessage",
            value: function showGameOverMessage(finalScore, didWin, winScore, maxGameTime, actualTime) {
                var _this = this;
                var achievedMedals = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : [];
                var gameOverContainer = this.createDOMElement('game-over-container', '');
                gameOverContainer.style.position = 'fixed';
                gameOverContainer.style.top = '0';
                gameOverContainer.style.left = '0';
                gameOverContainer.style.width = '100%';
                gameOverContainer.style.height = '100%';
                gameOverContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
                gameOverContainer.style.color = 'white';
                gameOverContainer.style.display = 'flex';
                gameOverContainer.style.flexDirection = 'column';
                gameOverContainer.style.justifyContent = 'center';
                gameOverContainer.style.alignItems = 'center';
                gameOverContainer.style.zIndex = '1002'; // Above everything else
                gameOverContainer.style.fontFamily = 'Arial, sans-serif';
                gameOverContainer.style.textAlign = 'center';
                var titleText = didWin ? "You Won!" : "Time's Up!";
                var titleColor = didWin ? '#4CAF50' : '#F44336'; // Green for win, Red for loss
                var title = this.createDOMElement('game-over-title', titleText);
                title.style.fontSize = '48px';
                title.style.marginBottom = '20px';
                title.style.color = titleColor;
                var messageText;
                if (didWin) {
                    messageText = "Congratulations! You reached ".concat(finalScore, " points in ").concat(Math.floor(actualTime / 60), "m ").concat(Math.floor(actualTime % 60), "s.");
                } else {
                    messageText = "You scored ".concat(finalScore, " points. Goal was ").concat(winScore, ". Keep trying!");
                }
                var scoreDisplay = this.createDOMElement('game-over-score', messageText);
                scoreDisplay.style.fontSize = '24px'; // Adjusted for potentially longer text
                scoreDisplay.style.marginBottom = '20px'; // Adjusted margin
                scoreDisplay.style.maxWidth = '80%'; // Prevent overly wide text
                scoreDisplay.style.lineHeight = '1.5';
                var medalsContainer = this.createDOMElement('medals-container', '');
                medalsContainer.style.display = 'flex';
                medalsContainer.style.justifyContent = 'center';
                medalsContainer.style.alignItems = 'center';
                medalsContainer.style.gap = '10px';
                medalsContainer.style.marginBottom = '30px';
                if (didWin && achievedMedals.length > 0) {
                    var medalTitle = this.createDOMElement('medal-title', 'Medals Earned:');
                    medalTitle.style.fontSize = '20px';
                    medalTitle.style.marginBottom = '5px'; // Space between title and medals
                    medalsContainer.appendChild(medalTitle);
                    achievedMedals.forEach(function(medalType) {
                        var medalElement = _this.createDOMElement("medal-".concat(medalType.toLowerCase()), medalType);
                        medalElement.style.padding = '8px 15px';
                        medalElement.style.borderRadius = '5px';
                        medalElement.style.fontSize = '18px';
                        medalElement.style.fontWeight = 'bold';
                        switch(medalType){
                            case 'Platinum':
                                medalElement.style.backgroundColor = '#E5E4E2';
                                medalElement.style.color = '#333';
                                break; // Light Gray
                            case 'Gold':
                                medalElement.style.backgroundColor = '#FFD700';
                                medalElement.style.color = '#333';
                                break; // Gold
                            case 'Silver':
                                medalElement.style.backgroundColor = '#C0C0C0';
                                medalElement.style.color = '#333';
                                break; // Silver
                            case 'Bronze':
                                medalElement.style.backgroundColor = '#CD7F32';
                                medalElement.style.color = 'white';
                                break; // Bronze
                        }
                        medalsContainer.appendChild(medalElement);
                    });
                }
                var refreshButton = this.createDOMElement('game-over-refresh', 'Play Again?', 'button');
                refreshButton.style.padding = '15px 30px';
                refreshButton.style.fontSize = '20px';
                refreshButton.style.backgroundColor = '#2196F3'; // A neutral blue for play again
                refreshButton.style.color = 'white';
                refreshButton.style.border = 'none';
                refreshButton.style.borderRadius = '8px';
                refreshButton.style.cursor = 'pointer';
                refreshButton.addEventListener('click', function() {
                    return window.location.reload();
                });
                gameOverContainer.appendChild(title);
                gameOverContainer.appendChild(scoreDisplay);
                if (didWin && achievedMedals.length > 0) {
                    gameOverContainer.appendChild(medalsContainer);
                }
                gameOverContainer.appendChild(refreshButton);
                document.body.appendChild(gameOverContainer);
                this.gameOverContainer = gameOverContainer; // Store for potential cleanup
            }
        },
        {
            key: "destroy",
            value: function destroy() {
                if (this.scoreElement && this.scoreElement.parentNode) {
                    this.scoreElement.parentNode.removeChild(this.scoreElement);
                }
                if (this.instructionsElement && this.instructionsElement.parentNode) {
                    this.instructionsElement.parentNode.removeChild(this.instructionsElement);
                }
                if (this.timerElement && this.timerElement.parentNode) {
                    this.timerElement.parentNode.removeChild(this.timerElement);
                }
                if (this.energyElement && this.energyElement.parentNode) {
                    this.energyElement.parentNode.removeChild(this.energyElement);
                }
                if (this.biodiversityBonusElement && this.biodiversityBonusElement.parentNode) {
                    this.biodiversityBonusElement.parentNode.removeChild(this.biodiversityBonusElement);
                }
                if (this.toolsContainer && this.toolsContainer.parentNode) {
                    this.toolsContainer.parentNode.removeChild(this.toolsContainer);
                }
                if (this.plantSelectorContainer && this.plantSelectorContainer.parentNode) {
                    this.plantSelectorContainer.parentNode.removeChild(this.plantSelectorContainer);
                }
                if (this.menuToggleButton && this.menuToggleButton.parentNode) {
                    this.menuToggleButton.parentNode.removeChild(this.menuToggleButton);
                }
                if (this.guideButton && this.guideButton.parentNode) {
                    this.guideButton.parentNode.removeChild(this.guideButton);
                }
                if (this.resetButton && this.resetButton.parentNode) {
                    this.resetButton.parentNode.removeChild(this.resetButton);
                }
                if (this.guidePanel && this.guidePanel.parentNode) {
                    // Remove close button listener if it exists
                    var closeButton = this.guidePanel.querySelector('#close-guide-button');
                    if (closeButton && this.boundCloseGuide) {
                        closeButton.removeEventListener('click', this.boundCloseGuide);
                    }
                    this.guidePanel.parentNode.removeChild(this.guidePanel);
                }
                if (this.gameOverContainer && this.gameOverContainer.parentNode) {
                    this.gameOverContainer.parentNode.removeChild(this.gameOverContainer);
                }
            // Event listeners on buttons are implicitly removed when containers are removed
            }
        }
    ]);
    return UI;
}();
