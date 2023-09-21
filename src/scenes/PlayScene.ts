import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/Player";
import GameScene from "./GameScene";

class PlayScene extends GameScene {
  player: Player; // Declaramos el dino
  startTrigger: SpriteWithDynamicBody; // Disparador del juego
  ground: Phaser.GameObjects.TileSprite; // Suelo
  obstacles: Phaser.Physics.Arcade.Group; // Creamos un grupo para almacenar los cactus

  spawnInterval: number = 1500; // Intervalo de generación para los obstáculos 1.5 s
  spawnTime: number = 0; // Tiempo de generación

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

    this.obstacles = this.physics.add.group();

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
            this.isGameRunning = true; // Empezamos el juego
          }
        },
      });
    });
  }

  update(time: number, delta: number): void {
    // Delta = tiempo entre fotogramas 16p/s
    // Aumentamos tiempo de generación
    this.spawnTime += delta;
    // Si el tiempo de genración es mayor que el intervalo generamos el obstáculo
    if (this.spawnInterval >= this.spawnInterval) {
      this.spawnObstacle();
      this.spawnTime = 0;
    }
  }

  createPlayer() {
    // Creamos objeto físico porque tendrá gravedad y se le aplicarán colisiones
    this.player = new Player(this, 0, this.gameHeight);
  }

  createEnviroment() {
    // 1 punto origen X, 2 punto origen Y, ancho del objeto, 4 alto
    // Añadimos el suelo, hasta que el dino cae el ancho serán 150px
    this.ground = this.add
      .tileSprite(0, this.gameHeight, 150, 26, "ground")
      .setOrigin(0, 1);
  }

  spawnObstacle() {
    // Generamos un número random entre 1 y 6 para escoger un cactus de los 6 que hay
    const obstacleNum = Math.floor(Math.random() * 6) + 1;
    const distance = Phaser.Math.Between(600, 900);

    this.obstacles
      .create(distance, this.gameHeight, `obstacle-${obstacleNum}`)
      .setOrigin(0, 1);
  }
}

export default PlayScene;
