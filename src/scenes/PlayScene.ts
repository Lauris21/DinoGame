import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/Player";
import GameScene from "./GameScene";
import { preloadConfig } from "..";

class PlayScene extends GameScene {
  player: Player; // Declaramos el dino
  startTrigger: SpriteWithDynamicBody; // Disparador del juego
  ground: Phaser.GameObjects.TileSprite; // Suelo
  obstacles: Phaser.Physics.Arcade.Group; // Creamos un grupo para almacenar los cactus
  clouds: Phaser.GameObjects.Group;

  scoreText: Phaser.GameObjects.Text;
  gameOverContainer: Phaser.GameObjects.Container;
  gameOvertext: Phaser.GameObjects.Image;
  restartText: Phaser.GameObjects.Image;

  highScoreText: Phaser.GameObjects.Text;
  score: number = 0;
  scoreInterval: number = 100;
  scoreDeltaTime: number = 0;

  gameSpeed: number = 5; // Velocidad del cactus
  spawnInterval: number = 1500; // Intervalo de generación para los obstáculos 1.5 s
  spawnTime: number = 0; // Tiempo de generación
  gameSpeedModifier: number = 1; // Actualización de velocidad

  constructor() {
    super("PlayScene");
  }

  create() {
    this.createEnviroment();
    this.createPlayer();
    this.createObstacles();
    this.createGameOverContainer();
    this.createAnimations();
    this.createScore();

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
    this.scoreDeltaTime += delta;

    // Aumentamos puntuación
    if (this.scoreDeltaTime >= this.scoreInterval) {
      this.score++;
      this.scoreDeltaTime = 0;
    }

    // Si el tiempo de genración es mayor que el intervalo generamos el obstáculo
    if (this.spawnTime >= this.spawnInterval) {
      this.spawnObstacle();
      this.spawnTime = 0;
    }

    if (this.score % 100 === 0) {
      // Cuando pasemos de 100 aumentamos dificultad
      this.gameSpeedModifier += 1;
    }

    Phaser.Actions.IncX(
      this.obstacles.getChildren(),
      -this.gameSpeed * this.gameSpeedModifier
    ); // Decrentamos posición X de todos los cactus
    Phaser.Actions.IncX(this.clouds.getChildren(), -0.5); // Cambiamos posición nubes

    // Cada vez que el suelo avanza aumentamos puntuación
    const score = Array.from(String(this.score), Number); // Creamos un array a partir de los números --> ejem 10 --> ["1", "0"]

    for (let i = 0; i < 5 - String(this.score).length; i++) {
      // Le añadimos los 0 que faltan al array de puntuación para que sean 5 dígitos
      score.unshift(0);
    }

    this.scoreText.setText(score.join("")); // Unimos el array y obtenemos un string

    this.obstacles.getChildren().forEach((obstacle: SpriteWithDynamicBody) => {
      if (obstacle.getBounds().right < 0) {
        this.obstacles.remove(obstacle);
      }
    });

    this.clouds.getChildren().forEach((cloud: SpriteWithDynamicBody) => {
      if (cloud.getBounds().right < 0) {
        cloud.x = this.gameWidth + 30;
      }
    });

    this.ground.tilePositionX += this.gameSpeed * this.gameSpeedModifier; // Reciclamos suelo y generamos movimiento
  }

  createPlayer() {
    // Creamos objeto físico porque tendrá gravedad y se le aplicarán colisiones
    this.player = new Player(this, 0, this.gameHeight);
  }

  createEnviroment() {
    // 1 punto origen X, 2 punto origen Y, ancho del objeto, 4 alto
    // Añadimos el suelo, hasta que el dino cae el ancho serán 150px
    this.ground = this.add
      .tileSprite(0, this.gameHeight, 88, 26, "ground")
      .setOrigin(0, 1);

    this.clouds = this.add.group();
    // Creamos las nubes que serán recicladas al salir de la escena
    this.clouds = this.clouds.addMultiple([
      this.add.image(this.gameWidth / 2, 170, "cloud"),
      this.add.image(this.gameWidth - 80, 80, "cloud"),
      this.add.image(this.gameWidth / 1.3, 100, "cloud"),
    ]);

    this.clouds.setAlpha(0);
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

  createAnimations() {
    this.anims.create({
      key: "enemy-bird-fly",
      frames: this.anims.generateFrameNumbers("enemy-bird"),
      frameRate: 6,
      repeat: -1,
    });
  }

  createScore() {
    this.scoreText = this.add
      .text(this.gameWidth, 0, "00000", {
        fontSize: 30,
        fontFamily: "Arial",
        color: "#535353",
        resolution: 5,
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.highScoreText = this.add
      .text(this.scoreText.getBounds().left - 20, 0, "00000", {
        fontSize: 30,
        fontFamily: "Arial",
        color: "#535353",
        resolution: 5,
      })
      .setOrigin(1, 0)
      .setAlpha(0);
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
            this.clouds.setAlpha(1); // Mostramos las nubes
            this.scoreText.setAlpha(1); // Mostramos el texto de puntuación
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
      this.anims.pauseAll();
      this.player.die();
      this.gameOverContainer.setAlpha(1); // setAlpha(1) --> Hace que aparezca

      // "Hi 00032".substring(3) --> "00032" nos quedamos con los números
      const newHighScore = this.highScoreText.text.substring(
        this.highScoreText.text.length - 5
      );

      const newScore =
        Number(this.scoreText.text) > Number(newHighScore)
          ? this.scoreText.text
          : newHighScore;

      this.highScoreText.setText(`Hi ${newScore}`);
      this.highScoreText.setAlpha(1);

      this.score = 0;
      this.scoreDeltaTime = 0; // Reiniciamos contador puntuación
      // Reestablecemos la frecuencia en la que salen los obstáculos
      this.spawnTime = 0;
      this.gameSpeedModifier = 1; // Reiniciamos velocidad
    });
  }

  handleGameRestart() {
    this.restartText.on("pointerdown", () => {
      this.physics.resume();
      this.player.setVelocityY(0);
this.highScoreText.setAlpha(0);
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

    const distance = Phaser.Math.Between(150, 300);
    let obstacle;

    if (obstacleNum > preloadConfig.cactusesCount) {
      // Configuramos altura del pájaro
      const enemyPossibleHeight = [20, 70];
      const enemyHeight =
        enemyPossibleHeight[
          Math.floor(Math.random() * enemyPossibleHeight.length)
        ];

      obstacle = this.obstacles
        .create(
          this.gameWidth + distance,
          this.gameHeight - enemyHeight,
          `enemy-bird`
        )
        .setOrigin(0, 1)
        .setImmovable(); // Evitamos que se desplazcan al ser golpeados

      obstacle.play("enemy-bird-fly", true);
    } else {
      obstacle = this.obstacles
        .create(
          this.gameWidth + distance,
          this.gameHeight,
          `obstacle-${obstacleNum}`
        )
        .setOrigin(0, 1)
        .setImmovable(); // Evitamos que se desplazcan al ser golpeados
    }
  }
}

export default PlayScene;
