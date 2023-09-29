import { preloadConfig } from "..";
import GameScene from "./GameScene";

class PreloadScene extends GameScene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("ground", "assets/ground.png");
    this.load.image("dino-idle", "assets/dino-idle-2.png");
    this.load.image("dino-hurt", "assets/dino-hurt.png");
    this.load.image("restart", "assets/restart.png");
    this.load.image("game-over", "assets/game-over.png");

    for (let i = 0; i < preloadConfig.cactusesCount; i++) {
      let cactusNum = i + 1;
      this.load.image(
        `obstacle-${cactusNum}`,
        `assets/cactuses_${cactusNum}.png`
      ); // Cargamos los cactus
    }

    // Cargamos la imagen que aparecen 4 dinos en diferentes posturas
    this.load.spritesheet("dino-run", "assets/dino-run.png", {
      frameWidth: 88,
      frameHeight: 94,
    });

     // Cargamos la imagen que aparecen 2 dinos agachados
     this.load.spritesheet("dino-down", "assets/dino-down-2.png", {
      frameWidth: 88,
      frameHeight: 94,
    });
  }

  create() {
    this.scene.start("PlayScene");
  }
}

export default PreloadScene;
