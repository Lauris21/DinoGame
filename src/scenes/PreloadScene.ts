import GameScene from "./GameScene";

class PreloadScene extends GameScene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("ground", "assets/ground.png");
    this.load.image("dino-idle", "assets/dino-idle2.png");

    this.load.image("obstacle-1", "assets/cactuses_1.png");
    this.load.image("obstacle-2", "assets/cactuses_2.png");
    this.load.image("obstacle-3", "assets/cactuses_3.png");
    this.load.image("obstacle-4", "assets/cactuses_4.png");
    this.load.image("obstacle-5", "assets/cactuses_5.png");
    this.load.image("obstacle-6", "assets/cactuses_6.png");

    // Cargamos la imagen que aparecen 4 dinos en diferentes posturas
    this.load.spritesheet("dino-run", "assets/dino-run.png", {
      frameWidth: 88,
      frameHeight: 94,
    });
  }

  create() {
    this.scene.start("PlayScene");
  }
}

export default PreloadScene;
