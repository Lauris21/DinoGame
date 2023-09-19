import Phaser from "phaser";

class PlayScene extends Phaser.Scene {

    player : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    // Utilidad de typescript
    get gameHeight() {
        return this.game.config.height as number
    }
    constructor() {
        super("PlayScene")
    }

    create() {
        this.createPlayer()
        this.createEnviroment()
    }

    createPlayer() {
        // Creamos objeto físico porque tendrá gravedad y se le aplicarán colisiones
        this.physics.add.sprite(0, this.gameHeight, "dino-idle").setOrigin(0, 1)
    }
    createEnviroment() {
        // 1 punto origen X, 2 punto origen Y, ancho del objeto, 4 alto
        // Añadimos el suelo, hasta que el dino cae el ancho serán 150px
        this.add.tileSprite(0, this.gameHeight, 150, 26, "ground").setOrigin(0, 1)
    }
}

export default PlayScene