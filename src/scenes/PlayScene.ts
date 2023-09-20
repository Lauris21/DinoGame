import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";

class PlayScene extends Phaser.Scene {

    // Declaramos el dino
    player : SpriteWithDynamicBody
    // Utilidad de typescript retorna altura de juego en numero
    get gameHeight() {
        return this.game.config.height as number
    }
    constructor() {
        super("PlayScene")
    }

    create() {
        this.createPlayer()
        this.createEnviroment()
        this.registerPlayerControl()
    }

    createPlayer() {
        // Creamos objeto físico porque tendrá gravedad y se le aplicarán colisiones
        this.player = this.physics.add.sprite(0, this.gameHeight, "dino-idle").setOrigin(0, 1)
        // Hacemos que baje cuando estamos en el aire
        this.player.setGravityY(5000)
        // Añadimos fronteras de colisión
        this.player.setCollideWorldBounds(true)
        // Ajustamos tamaño para las colisiones
        this.player.setSize(44, 92)
    }
    createEnviroment() {
        // 1 punto origen X, 2 punto origen Y, ancho del objeto, 4 alto
        // Añadimos el suelo, hasta que el dino cae el ancho serán 150px
        this.add.tileSprite(0, this.gameHeight, 150, 26, "ground").setOrigin(0, 1)
    }

    // Codificamos la tecla espacio para que salte
    registerPlayerControl() {
        const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        spaceBar.on("down", () => {
            // Para que salte debemos cambiar la velocidad y ponerla negativa
            this.player.setVelocityY(-1000 )
            
        })
    }
}

export default PlayScene