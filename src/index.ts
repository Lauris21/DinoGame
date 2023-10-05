import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import PlayScene from "./scenes/PlayScene";

export const preloadConfig = {
  cactusesCount: 6,
  birdsCount: 1,
};

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 340,
  // Los pixeles se ajustan al elemento
  pixelArt: true,
  // fondo transparente
  transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [PreloadScene, PlayScene],
};

new Phaser.Game(config);
