export class Player extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
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
      .setBodySize(44, 92);
  }

  update() {
    const { space } = this.cursors;

    // Aunque mantengamos el espacio pulsado baja
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space); // Solo es positivo cuando tocas el espacio una vez

    // Evitamos que salte en el aire
    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor(); // Devuelve true cuando esta en el suelo

    // Cuando pulsamos espacio y estamos en el suelo saltamos
    if (isSpaceJustDown && onFloor) {
      // Para que salte debemos cambiar la velocidad y ponerla negativa
      this.setVelocityY(-1600);
    }
  }
}
