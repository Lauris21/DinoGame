class GameScene extends Phaser.Scene {
  constructor(key: string) {
    super(key);
  }

  isGameRunning: Boolean = false; // Verificamos si el juego ha empezado

  // GET --> Utilidad de typescript retorna altura de juego en numero
  get gameHeight() {
    return this.game.config.height as number;
  }
  get gameWidth() {
    return this.game.config.width as number;
  }
}

export default GameScene;
