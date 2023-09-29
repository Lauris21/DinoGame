import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/Player";
import GameScene from "./GameScene";
import { preloadConfig } from "..";

class PlayScene extends GameScene {
  player: Player; // Declaramos el dino
  startTrigger: SpriteWithDynamicBody; // Disparador del juego
  ground: Phaser.GameObjects.TileSprite; // Suelo
  obstacles: Phaser.Physics.Arcade.Group; // Creamos un grupo para almacenar los cactus

  gameOverContainer: Phaser.GameObjects.Container;
  gameOvertext: Phaser.GameObjects.Image;
  restartText: Phaser.GameObjects.Image;

  gameSpeed: number = 5; // Velocidad del cactus
  spawnInterval: number = 1500; // Intervalo de generación para los obstáculos 1.5 s
  spawnTime: number = 0; // Tiempo de generación

  constructor() {
    super("PlayScene");
  }

  create() {
    this.createEnviroment();
    this.createPlayer();
    this.createObstacles();
    this.createGameOverContainer();

    this.handleGameStart();
    this.handleObstacleCollison();
    this.handleGameRestart();
  }

  update(time: number, delta: number): void {
    if (!this.isGameRunning) {
      return;
    }
    // Delta = tiempo entre fotogramas 16p/s
    this.spawnTime += delta; // Aumentamos tiempo de generación
    // Si el tiempo de genración es mayor que el intervalo generamos el obstáculo
    if (this.spawnTime >= this.spawnInterval) {
      this.spawnObstacle();
      this.spawnTime = 0;
    }

    Phaser.Actions.IncX(this.obstacles.getChildren(), -10, -this.gameSpeed); // Decrentamos posición X de todos los cactus

    this.obstacles.getChildren().forEach((obstacle: SpriteWithDynamicBody) => {
      if (obstacle.getBounds().right < 0) {
        this.obstacles.remove(obstacle);
      }
    });

    this.ground.tilePositionX += this.gameSpeed; // Reciclamos suelo y generamos movimiento
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

  createObstacles() {
    this.obstacles = this.physics.add.group();
  }

  createGameOverContainer() {
    this.gameOvertext = this.add.image(0, 0, "game-over");
    this.restartText = this.add.image(0, 80, "restart").setInteractive();

    this.gameOverContainer = this.add // Colocamos los textos en un contenedor
      .container(this.gameWidth / 2, this.gameHeight / 2 - 50)
      .add([this.gameOvertext, this.restartText])
      .setAlpha(0); // setAlpha(0) --> Hace que no aparezca
  }

  handleGameStart() {
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
            this.isGameRunning = true; // Empezamos el juego
          }
        },
      });
    });
  }

  handleObstacleCollison() {
    this.physics.add.collider(this.obstacles, this.player, () => {
      this.isGameRunning = false;
      this.physics.pause(); // Cuando chocan los cactus ocn el dino se para el juego
      this.player.die();
      this.gameOverContainer.setAlpha(1); // setAlpha(1) --> Hace que aparezca

      // Reestablecemos la frecuencia en la que salen los obstáculos
      this.spawnTime = 0;
      this.gameSpeed = 5;
    });
  }

  handleGameRestart() {
    this.restartText.on("pointerdown", () => {
      this.physics.resume();
      this.player.setVelocityY(0);

      this.obstacles.clear(true, true);
      this.gameOverContainer.setAlpha(0);
      this.anims.resumeAll();
      this.isGameRunning = true;
    });
  }

  spawnObstacle() {
    // Generamos un número random entre 1 y 7 para escoger entre cactus de los 6 que hay o pájaro que hay 1
    const obstacleNum =
      Math.floor(
        Math.random() * (preloadConfig.cactusesCount + preloadConfig.birdsCount)
      ) + 1;

    const distance = Phaser.Math.Between(600, 900);

    if (obstacleNum > preloadConfig.cactusesCount) {
      // Configuramos altura del pájaro
      const enemyPossibleHeight = [20, 70];
      const enemyHeight =
        enemyPossibleHeight[
          Math.floor(Math.random() * enemyPossibleHeight.length)
        ];
      this.obstacles
        .create(distance, this.gameHeight - enemyHeight, `enemy-bird`)
        .setOrigin(0, 1)
        .setImmovable(); // Evitamos que se desplazcan al ser golpeados
    } else {
      this.obstacles
        .create(distance, this.gameHeight, `obstacle-${obstacleNum}`)
        .setOrigin(0, 1)
        .setImmovable(); // Evitamos que se desplazcan al ser golpeados
    }
  }
}

export default PlayScene;
