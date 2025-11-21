export class UIManager {
    constructor(scene, callbacks) {
        this.scene = scene;
        this.callbacks = callbacks;
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        this.createScoreText();
        this.createStartMenu();
        this.createGameOverMenu();
    }

    createScoreText() {
        this.scoreText = new BABYLON.GUI.TextBlock();
        this.scoreText.text = "Pontuação: 0";
        this.scoreText.color = "white";
        this.scoreText.fontSize = 24;
        this.scoreText.fontFamily = "Consolas, monospace";
        this.scoreText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.scoreText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.scoreText.paddingTop = "10px";
        this.scoreText.paddingRight = "10px";
        this.advancedTexture.addControl(this.scoreText);
    }

    createStartMenu() {
        this.startMenu = new BABYLON.GUI.TextBlock();
        this.startMenu.text = "CORREDOR DE NEONS\n\nPressione ESPAÇO para iniciar";
        this.startMenu.color = "white";
        this.startMenu.fontSize = 32;
        this.startMenu.fontFamily = "Consolas, monospace";
        this.advancedTexture.addControl(this.startMenu);
    }

    createGameOverMenu() {
        this.gameOverMenu = new BABYLON.GUI.Rectangle();
        this.gameOverMenu.width = "450px";
        this.gameOverMenu.height = "220px";
        this.gameOverMenu.cornerRadius = 20;
        this.gameOverMenu.color = "white";
        this.gameOverMenu.thickness = 2;
        this.gameOverMenu.background = "rgba(0, 0, 0, 0.7)";
        this.gameOverMenu.isVisible = false;
        this.advancedTexture.addControl(this.gameOverMenu);

        const stack = new BABYLON.GUI.StackPanel();
        this.gameOverMenu.addControl(stack);

        const title = new BABYLON.GUI.TextBlock();
        title.text = "FIM DE JOGO";
        title.color = "red";
        title.fontSize = 36;
        title.height = "70px";
        stack.addControl(title);

        this.finalScoreText = new BABYLON.GUI.TextBlock();
        this.finalScoreText.color = "white";
        this.finalScoreText.fontSize = 24;
        this.finalScoreText.height = "50px";
        stack.addControl(this.finalScoreText);
        
        const restartBtn = BABYLON.GUI.Button.CreateSimpleButton("restart", "REINICIAR");
        restartBtn.width = "150px";
        restartBtn.height = "50px";
        restartBtn.color = "white";
        restartBtn.background = "green";
        restartBtn.paddingTop = "10px";
        restartBtn.onPointerUpObservable.add(() => {
            this.callbacks.onRestart();
        });
        stack.addControl(restartBtn);
    }

    updateScore(score) {
        this.scoreText.text = "Pontuação: " + Math.floor(score);
    }

    showGameOver(score) {
        this.finalScoreText.text = "Pontuação final: " + Math.floor(score);
        this.gameOverMenu.isVisible = true;
    }

    hideStartMenu() {
        this.startMenu.isVisible = false;
    }

    hideGameOver() {
        this.gameOverMenu.isVisible = false;
    }
}