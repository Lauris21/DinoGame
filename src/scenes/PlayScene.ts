import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/Player";

class PlayScene extends Phaser.Scene {
  // Declaramos el dino
  player: Player;
  // Disparador del juego
  startTrigger: SpriteWithDynamicBody;
  // Utilidad de typescript retorna altura de juego en numero
  get gameHeight() {
    return this.game.config.height as number;
  }
  constructor() {
    super("PlayScene");
  }

  create() {
    this.createEnviroment();
    this.createPlayer();
    // Creamos elemento invisible en la parte superior
    this.startTrigger = this.physics.add
      .sprite(0, 10, null)
      .setAlpha(0)
      .setOrigin(0, 1);

    // Cuando chocan entre los elementos
    this.physics.add.overlap(this.startTrigger, this.player, () => {
      console.log("choque");
    });
  }

  createPlayer() {
    // Creamos objeto físico porque tendrá gravedad y se le aplicarán colisiones
    this.player = new Player(this, 0, this.gameHeight, "dino-idle");
  }
  createEnviroment() {
    // 1 punto origen X, 2 punto origen Y, ancho del objeto, 4 alto
    // Añadimos el suelo, hasta que el dino cae el ancho serán 150px
    this.add.tileSprite(0, this.gameHeight, 150, 26, "ground").setOrigin(0, 1);
  }
}

export default PlayScene;
