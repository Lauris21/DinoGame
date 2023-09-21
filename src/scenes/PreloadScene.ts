import { preloadConfig } from "..";
import GameScene from "./GameScene";

class PreloadScene extends GameScene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("ground", "assets/ground.png");
    this.load.image("dino-idle", "assets/dino-idle-2.png");

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
  }

  create() {
    this.scene.start("PlayScene");
  }
}

export default PreloadScene;
