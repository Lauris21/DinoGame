import GameScene from "../scenes/GameScene";

export class Player extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  scene: GameScene;
  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "dino-run");
    // Lo registramos como un objeto de juego
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();

    // Activamos el escuchador de actualización
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  init() {
    // Recogemos las teclas para luego quedarnos con el espacio
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    // Hacemos que caiga cuando estamos en el aire, Añadimos fronteras de colisión,  Ajustamos tamaño para las colisiones
    this.setOrigin(0, 1)
      .setGravityY(5000)
      .setCollideWorldBounds(true)
      .setBodySize(44, 92)
      .setOffset(20, 0);

    this.registerAnimations();
  }

  update() {
    const { space, down } = this.cursors;

    // Aunque mantengamos el espacio pulsado baja
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space); // Solo es positivo cuando tocas el espacio una vez
    const isDownJustDown = Phaser.Input.Keyboard.JustDown(down); // Agachamos al dino
    // Cuando soltamos flecha
    const isDownJustUp = Phaser.Input.Keyboard.JustUp(down);

    // Evitamos que salte en el aire
    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor(); // Devuelve true cuando esta en el suelo

    // Cuando pulsamos espacio y estamos en el suelo saltamos
    if (isSpaceJustDown && onFloor) {
      // Para que salte debemos cambiar la velocidad y ponerla negativa
      this.setVelocityY(-1600);
    }

    // Cambiamos posición cuando pulsamos flecha abajo
    if (isDownJustDown && onFloor) {
      this.body.setSize(this.body.width, 58);
      this.setOffset(60, 34);
    }

    // Reestablecemos posición cuando soltamos flecha abajo
    if (isDownJustUp && onFloor) {
      this.body.setSize(44, 92);
      this.setOffset(20, 0);
    }

    if (!this.scene.isGameRunning) {
      return; // Si no ha empezado el juego no ejecutamos animación
    }

    // Verificamos la dirección del eje y del cuerpo del dino
    if (this.body.deltaAbsY() > 0) {
      // si es mayor que 0 esta saltando entonces pararemos la animación
      this.anims.stop();
      this.setTexture("dino-run", 0);
    } else {
      this.playRunAnimation();
    }
  }

  playRunAnimation() {
    this.body.height <= 58
      ? this.play("dino-down", true) // Ejecutamos dino agachado
      : this.play("dino-run", true); // Ejecutamos dino en movimiento
  }

  registerAnimations() {
    this.anims.create({
      key: "dino-run",
      frames: this.anims.generateFrameNames("dino-run", { start: 2, end: 3 }), // Marcos --> imágenes penúltima y última
      frameRate: 10, // Fotogramas por segundo
      repeat: -1, // Infinito
    });

    this.anims.create({
      key: "dino-down",
      frames: this.anims.generateFrameNames("dino-down"),
      frameRate: 10, // Fotogramas por segundo
      repeat: -1, // Infinito
    });
  }

  die() {
    this.anims.pause();
    this.setTexture("dino-hurt");
  }
}
