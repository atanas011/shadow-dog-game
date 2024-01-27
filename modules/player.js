import {
    Sitting,
    Running,
    Jumping,
    Falling,
    Rolling,
    Diving,
    Hit
} from './playerStates.js'

import Collision from './collision.js'
import FloatingPoints from './floatingPoints.js'

export default class Player {
    constructor(game) {
        this.game = game
        this.img = player
        this.width = 100
        this.height = 91.3
        this.x = 0
        this.y = this.game.height - this.height - this.game.groundMargin
        this.speed = 0
        this.maxSpeed = 10
        this.vy = 0
        this.weight = 1
        this.states = [
            new Sitting(this.game),
            new Running(this.game),
            new Jumping(this.game),
            new Falling(this.game),
            new Rolling(this.game),
            new Diving(this.game),
            new Hit(this.game),
        ]
        this.frameX = 0
        this.frameY = 5
        this.fps = 50
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps
        this.score = 0
        this.currentState = null
    }

    update(input, deltaTime) {
        if (this.currentState == this.states[0]) this.game.maxTime += deltaTime // stop timer

        this.checkCollision()
        this.currentState.handleInput(input)

        this.x += this.speed
        this.speed = (input.includes('ArrowRight') && this.currentState != this.states[6]) ? this.maxSpeed :
            (input.includes('ArrowLeft') && this.currentState != this.states[6]) ? -this.maxSpeed : 0
        if (this.x < 0) this.x = 0
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width

        this.y += this.vy
        !this.isOnGround() ? this.vy += this.weight : this.vy = 0
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin
        }

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0
        } else {
            this.frameTimer += deltaTime
        }
    }

    draw(ctx) {
        if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height)

        ctx.drawImage(
            this.img, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height
        )
    }

    isOnGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin
    }

    setState(state, speed) {
        this.currentState = this.states[state]
        this.game.speed = this.game.maxSpeed * speed
        this.currentState.enter()
    }

    checkCollision() {
        this.game.enemies.forEach(e => {
            if (
                e.x < this.x + this.width &&
                e.x + e.width > this.x &&
                e.y < this.y + this.height &&
                e.y + e.height > this.y
            ) {
                e.markedForDeletion = true
                this.game.collisions.push(new Collision(this.game, e.x + e.width * .5, e.y + e.height * .5))
                if (this.currentState == this.states[4] || this.currentState == this.states[5]) {
                    this.game.score++
                    this.game.floatingMessages.push(new FloatingPoints('+1', e.x, e.y, 100, 45))
                } else {
                    this.setState(6, 0)
                    if (this.game.score > 0) this.game.score--
                    this.game.lives--
                    if (this.game.lives < 1) this.game.gameOver = true
                }
            }
        })
    }
}
