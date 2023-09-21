import { preloadConfig } from "..";
import GameScene from "./GameScene";

class PreloadScene extends GameScene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("ground", "assets/ground.png");
    this.load.image("dino-idle", "assets/dino-idle2.png");

    for (let i = 1; i < preloadConfig.cactusesCount; i++) {
      this.load.image(`obstacle-${i}`, `assets/cactuses_${i}.png`); // Cargamos los cactus
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
