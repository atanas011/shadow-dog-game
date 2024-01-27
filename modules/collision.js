import random from './util.js'

export default class Collision {
    constructor(game, x, y) {
        this.game = game
        this.img = collision
        this.spriteWidth = 100
        this.spriteHeight = 90
        this.sizeFactor = random(1) + .5
        this.width = this.spriteWidth * this.sizeFactor
        this.height = this.spriteHeight * this.sizeFactor
        this.x = x - this.width * .5
        this.y = y - this.height * .5
        this.frameX = 0
        this.maxFrame = 4
        this.markedForDeletion = false
        this.fps = random(10) + 5
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.sound = new Audio()
        this.sound.src = 'assets/bark.mp3'
    }

    draw(ctx) {
        ctx.drawImage(
            this.img, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height
        )
    }

    update(deltaTime) {
        this.frameX == 0 && this.sound.play()

        this.x -= this.game.speed

        if (this.frameTimer > this.frameInterval) {
            this.frameX++
            this.frameTimer = 0
        } else {
            this.frameTimer += deltaTime
        }

        if (this.frameX > this.maxFrame) this.markedForDeletion = true
        // console.log(this.game.collisions)
    }
}
