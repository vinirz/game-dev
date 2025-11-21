import { Game } from './Game.js';

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const game = new Game(engine);

engine.runRenderLoop(() => {
    game.update();
});

window.addEventListener("resize", () => {
    engine.resize();
});