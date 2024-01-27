import random from './util.js'

class Particles {
    constructor(game) {
        this.game = game
        this.markedForDeletion = false
    }

    update() {
        this.x -= this.speedX + this.game.speed
        this.y -= this.speedY
        this.size *= .95
        if (this.size < .5) this.markedForDeletion = true
    }
}

export class Dust extends Particles {
    constructor(game, x, y) {
        super(game)
        this.x = x
        this.y = y
        this.size = random(10) + 10
        this.speedX = random(1)
        this.speedY = random(1)
        this.color = 'rgba(0, 0, 0, .2)'
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

export class Fire extends Particles {
    constructor(game, x, y) {
        super(game)
        this.x = x
        this.y = y
        this.img = fire
        this.size = random(100) + 50
        this.speedX = 1
        this.speedY = 1
        this.angle = 0
        this.va = random(.2) - .1
    }

    update() {
        super.update()
        this.angle += this.va
        this.x += Math.sin(this.angle * 5)
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.drawImage(this.img, -this.size * .5, -this.size * .5, this.size, this.size)
        ctx.restore()
    }
}

export class Splash extends Particles {
    constructor(game, x, y) {
        super(game)
        this.size = random(100) + 100
        this.x = x - this.size * .4
        this.y = y - this.size * .5
        this.img = fire
        this.speedX = random(6) - 4
        this.speedY = random(2) + 1
        this.gravity = 0
    }

    update() {
        super.update()
        this.gravity += .1
        this.yx += this.gravity
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.size, this.size)
    }
}
