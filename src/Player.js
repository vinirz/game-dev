import { CONFIG, LANES } from './constants.js';
import { createNeonMaterial } from './utils.js';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.mesh = BABYLON.MeshBuilder.CreateCylinder("player", {diameterTop: 0, height: 1.5, diameterBottom: 1.5, tessellation: 4}, scene);
        this.mesh.rotation.x = Math.PI / 2;
        this.mesh.position = new BABYLON.Vector3(0, 1, 0);
        
        this.currentColorIndex = 0;
        this.mesh.material = createNeonMaterial("playerMat", CONFIG.PLAYER_COLORS[0], scene);

        this.currentLane = 1;
        this.targetX = 0;
    }

    moveLeft() {
        if (this.currentLane > 0) {
            this.currentLane--;
            this.targetX = LANES[this.currentLane];
        }
    }

    moveRight() {
        if (this.currentLane < LANES.length - 1) {
            this.currentLane++;
            this.targetX = LANES[this.currentLane];
        }
    }

    switchColor() {
        this.currentColorIndex = (this.currentColorIndex + 1) % CONFIG.PLAYER_COLORS.length;
        this.mesh.material.emissiveColor = CONFIG.PLAYER_COLORS[this.currentColorIndex];
    }

    reset() {
        this.currentLane = 1;
        this.targetX = LANES[1];
        this.mesh.position.x = this.targetX;
        this.mesh.position.z = 0;
        this.currentColorIndex = 0;
        this.mesh.material.emissiveColor = CONFIG.PLAYER_COLORS[0];
    }

    update(speed) {
        this.mesh.position.z += speed;
        this.mesh.position.x = BABYLON.Scalar.Lerp(this.mesh.position.x, this.targetX, 0.15);
    }
    
    getPosition() {
        return this.mesh.position;
    }
}