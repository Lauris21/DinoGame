import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/Player";

class PlayScene extends Phaser.Scene {
  player: Player; // Declaramos el dino
  startTrigger: SpriteWithDynamicBody; // Disparador del juego
  ground: Phaser.GameObjects.TileSprite; // Suelo
  // GET --> Utilidad de typescript retorna altura de juego en numero
  get gameHeight() {
    return this.game.config.height as number;
  }
  get gameWidth() {
    return this.game.config.width as number;
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

    // Cuando chocan elementos
    this.physics.add.overlap(this.startTrigger, this.player, () => {
      // Comprobamos que la posición del el.invisible este arriba
      if (this.startTrigger.y == 10) {
        // Si esta arriba y chocan bajará al suelo
        this.startTrigger.body.reset(0, this.gameHeight);
        return;
      }

      this.startTrigger.body.reset(9999, 9999); // Movemos el elemento

      // Generamos el suelo
      const rollOutevent = this.time.addEvent({
        delay: 1000 / 60,
        loop: true,
        callback: () => {
          this.player.playRunAnimation(); // LLamamos a la animación
          this.player.setVelocityX(80); // Desplazamos el dino
          this.ground.width += 17 * 2; // Generamos el suelo
          // Cuando el suelo llegue al ancho de la escena
          if (this.ground.width >= this.gameWidth) {
            this.ground.width = this.gameWidth;
            rollOutevent.remove(); // Detenemos el bucle
            this.player.setVelocityX(0); // Paramos el dino
          }
        },
      });
    });
  }

  createPlayer() {
    // Creamos objeto físico porque tendrá gravedad y se le aplicarán colisiones
    this.player = new Player(this, 0, this.gameHeight, "dino-run");
  }
  createEnviroment() {
    // 1 punto origen X, 2 punto origen Y, ancho del objeto, 4 alto
    // Añadimos el suelo, hasta que el dino cae el ancho serán 150px
    this.ground = this.add
      .tileSprite(0, this.gameHeight, 150, 26, "ground")
      .setOrigin(0, 1);
  }

  update(time: number, delta: number): void {
    // Cuando el suelo llega al final se inicia
  }
}

export default PlayScene;
