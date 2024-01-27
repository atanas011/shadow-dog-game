import random from './util.js'

class Enemy {
    constructor() {
        this.frameX = 0
        this.frameY = 0
        this.fps = 20
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.markedForDeletion = false
    }

    update(deltaTime) {
        this.x -= this.speedX + this.game.speed
        this.y += this.speedY

        if (this.frameTimer > this.frameInterval) {
            (this.frameX < this.maxFrame) ? this.frameX++ : this.frameX = 0
            this.frameTimer = 0
        } else {
            this.frameTimer += deltaTime
        }

        if (this.x + this.width < 0) this.markedForDeletion = true
    }

    draw(ctx) {
        if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height)

        ctx.drawImage(
            this.img,
            this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height
        )
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game) {
        super()
        this.game = game
        this.width = 60
        this.height = 44
        this.img = enemy_fly
        this.x = this.game.width + random(this.game.width) * .5
        this.y = random(this.game.height) * .5
        this.speedX = random(1) + 1
        this.speedY = 0
        this.maxFrame = 5
        this.angle = 0
        this.va = random(.1) + .1
    }

    update(deltaTime) {
        super.update(deltaTime)
        this.angle += this.va
        this.y += Math.sin(this.angle)
    }
}

export class GroundEnemy extends Enemy {
    constructor(game) {
        super()
        this.game = game
        this.width = 60
        this.height = 87
        this.img = enemy_plant
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin
        this.speedX = 0
        this.speedY = 0
        this.maxFrame = 1
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game) {
        super()
        this.game = game
        this.width = 120
        this.height = 144
        this.img = enemy_spider_big
        this.x = this.game.width
        this.y = random(this.game.height) * .5
        this.speedX = 0
        this.speedY = random(1) > .5 ? 1 : -1
        this.maxFrame = 5
    }

    update(deltaTime) {
        super.update(deltaTime)
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1
        if (this.y < -this.height) this.markedForDeletion = true
    }

    draw(ctx) {
        super.draw(ctx)
        ctx.beginPath()
        ctx.moveTo(this.x + this.width / 2, 0)
        ctx.lineTo(this.x + this.width / 2, this.y + 50)
        ctx.stroke()
    }
}
