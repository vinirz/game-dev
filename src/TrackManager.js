import { CONFIG, LANES } from './constants.js';
import { createNeonMaterial } from './utils.js';

export class TrackManager {
    constructor(scene) {
        this.scene = scene;
        this.segments = [];
        this.obstacles = [];
        
        this.trackMaterial = new BABYLON.StandardMaterial("trackMat", scene);
        this.trackMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.5);
        this.trackMaterial.wireframe = true;

        this.initTrack();
    }

    initTrack() {
        for (let i = 0; i < CONFIG.NUM_TRACK_SEGMENTS; i++) {
            this.createSegment(i * CONFIG.TRACK_SEGMENT_LENGTH);
        }
    }

    createSegment(zPosition) {
        const segment = BABYLON.MeshBuilder.CreateGround("track", {width: CONFIG.LANE_WIDTH * 4, height: CONFIG.TRACK_SEGMENT_LENGTH}, this.scene);
        segment.material = this.trackMaterial;
        segment.position.z = zPosition;
        this.segments.push(segment);
    }

    spawnObstacles(segmentZ) {
        this.obstacles = this.obstacles.filter(obs => {
            if (obs.position.z < segmentZ - CONFIG.TRACK_SEGMENT_LENGTH / 2 || obs.position.z > segmentZ + CONFIG.TRACK_SEGMENT_LENGTH / 2) {
                return true;
            }
            obs.dispose();
            return false;
        });

        if (Math.random() > CONFIG.OBSTACLE_SPAWN_CHANCE) return;

        const isColorGate = Math.random() > 0.5;
        
        if (isColorGate) {
            const colorIndex = Math.floor(Math.random() * CONFIG.PLAYER_COLORS.length);
            const gate = BABYLON.MeshBuilder.CreateBox("gate", {width: CONFIG.LANE_WIDTH * 3.5, height: 4, depth: 0.5}, this.scene);
            gate.material = createNeonMaterial("gateMat", CONFIG.PLAYER_COLORS[colorIndex], this.scene);
            gate.position = new BABYLON.Vector3(0, 2, segmentZ);
            gate.isColorGate = true;
            gate.colorIndex = colorIndex;
            this.obstacles.push(gate);
        } else {
            const lane = Math.floor(Math.random() * 3);
            const wall = BABYLON.MeshBuilder.CreateBox("wall", {width: CONFIG.LANE_WIDTH * 0.8, height: 4, depth: 2}, this.scene);
            wall.material = createNeonMaterial("wallMat", CONFIG.OBSTACLE_COLOR, this.scene);
            wall.position = new BABYLON.Vector3(LANES[lane], 2, segmentZ);
            wall.isColorGate = false;
            this.obstacles.push(wall);
        }
    }

    update(playerZ) {
        this.segments.forEach(segment => {
            if (segment.position.z < playerZ - CONFIG.TRACK_SEGMENT_LENGTH) {
                segment.position.z += CONFIG.NUM_TRACK_SEGMENTS * CONFIG.TRACK_SEGMENT_LENGTH;
                this.spawnObstacles(segment.position.z);
            }
        });
    }

    reset() {
        this.obstacles.forEach(obs => obs.dispose());
        this.obstacles = [];
        this.segments.forEach((seg, i) => {
            seg.position.z = i * CONFIG.TRACK_SEGMENT_LENGTH;
        });
    }
}