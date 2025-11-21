import { CONFIG } from './constants.js';
import { Player } from './Player.js';
import { TrackManager } from './TrackManager.js';
import { UIManager } from './UIManager.js';

export class Game {
    constructor(engine) {
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);
        this.scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.1, 1);

        this.setupEnvironment();
        
        this.player = new Player(this.scene);
        this.trackManager = new TrackManager(this.scene);
        this.uiManager = new UIManager(this.scene, {
            onRestart: () => this.resetGame()
        });

        this.gameSpeed = CONFIG.INITIAL_SPEED;
        this.score = 0;
        this.state = 'MENU';

        this.setupInputs();
    }

    setupEnvironment() {
        this.camera = new BABYLON.UniversalCamera("univCam", new BABYLON.Vector3(0, 8, -15), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
        const glowLayer = new BABYLON.GlowLayer("glow", this.scene);
        glowLayer.intensity = 1.5;
    }

    setupInputs() {
        window.addEventListener("keydown", (e) => {
            if (this.state === 'MENU' && (e.key === ' ' || e.key === 'Enter')) {
                this.state = 'PLAYING';
                this.uiManager.hideStartMenu();
                return;
            }

            if (this.state !== 'PLAYING') return;

            if (e.key === 'a' || e.key === 'ArrowLeft') this.player.moveLeft();
            if (e.key === 'd' || e.key === 'ArrowRight') this.player.moveRight();
            if (e.key === ' ') this.player.switchColor();
        });
    }

    resetGame() {
        this.score = 0;
        this.gameSpeed = CONFIG.INITIAL_SPEED;
        this.player.reset();
        this.trackManager.reset();
        this.uiManager.hideGameOver();
        this.state = 'PLAYING';
    }

    endGame() {
        this.state = 'GAMEOVER';
        this.uiManager.showGameOver(this.score);
    }

    update() {
        this.scene.render();

        if (this.state !== 'PLAYING') return;

        if (this.gameSpeed < CONFIG.MAX_SPEED) this.gameSpeed += CONFIG.SPEED_INCREASE_RATE;
        
        this.score += this.gameSpeed / 10;
        this.uiManager.updateScore(this.score);

        this.player.update(this.gameSpeed);
        this.trackManager.update(this.player.getPosition().z);

        const pPos = this.player.getPosition();
        const targetCamPos = new BABYLON.Vector3(pPos.x, pPos.y + 7, pPos.z - 15);
        this.camera.position = BABYLON.Vector3.Lerp(this.camera.position, targetCamPos, 0.1);
        this.camera.setTarget(pPos);

        this.trackManager.obstacles.forEach(obs => {
            if (this.player.mesh.intersectsMesh(obs, false)) {
                if (obs.isColorGate) {
                    if (obs.colorIndex !== this.player.currentColorIndex) this.endGame();
                } else {
                    this.endGame();
                }
            }
        });
    }
}