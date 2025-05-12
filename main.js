import { Game } from './game.js';
var renderDiv = document.getElementById('renderDiv');
if (!renderDiv) {
    console.error('Fatal Error: renderDiv not found in the DOM.');
} else {
    var game = new Game(renderDiv);
    game.start(); // This will now show the title screen first
}
