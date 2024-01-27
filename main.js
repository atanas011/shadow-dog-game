import Player from './modules/player.js'
import InputHandler from './modules/input.js'
import Background from './modules/background.js'
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './modules/enemies.js'
import UI from './modules/UI.js'

window.addEventListener('load', () => {
    const ctx = canvas.getContext('2d')
    canvas.width = 1100
    canvas.height = 500

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.groundMargin = 30 // this must be before player! (80 for city)
            this.speed = 0
            this.maxSpeed = 3
            this.background = new Background(this)
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.ui = new UI(this)
            this.enemies = []
            this.particles = []
            this.collisions = []
            this.floatingMessages = []
            this.maxParticles = 200
            this.enemyTimer = 0
            this.enemyInterval = 1000
            this.debug = false
            this.fontColor = 'yellow'
            this.score = 0
            this.winningScore = 40
            this.time = 0
            this.maxTime = 30000
            this.gameOver = false
            this.lives = 5
            this.player.currentState = this.player.states[0] // this must be the last!
            this.player.currentState.enter() // this must be the last!

        }

        update(deltaTime) {
            this.maxTime -= deltaTime
            if (this.maxTime <= this.time) {
                this.gameOver = true
                this.maxTime = -this.maxTime // prevents -0.0
            }

            this.background.update() // this must be before player!

            this.player.update(this.input.keys, deltaTime)

            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy()
                this.enemyTimer = 0
            } else {
                this.enemyTimer += deltaTime
            }
            this.enemies.forEach(e => e.update(deltaTime))
            this.enemies = this.enemies.filter(e => !e.markedForDeletion)

            this.floatingMessages.forEach(m => m.update())
            this.floatingMessages = this.floatingMessages.filter(m => !m.markedForDeletion)

            this.particles.forEach(p => p.update())
            this.particles = this.particles.filter(p => !p.markedForDeletion)
            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles
            }
            // console.log(this.particles)
            this.collisions.forEach(c => {
                c.update(deltaTime)
                this.collisions = this.collisions.filter(c => !c.markedForDeletion)
            })
        }

        draw(ctx) {
            this.background.draw(ctx) // this must be before player!
            this.player.draw(ctx)
            this.enemies.forEach(e => e.draw(ctx))
            this.particles.forEach(p => p.draw(ctx))
            this.collisions.forEach(c => c.draw(ctx))
            this.ui.draw(ctx)
            this.floatingMessages.forEach(m => m.draw(ctx))
        }

        addEnemy() {
            this.enemies.push(new FlyingEnemy(this))
            if (this.speed > 0 && Math.random() < .5) this.enemies.push(new GroundEnemy(this))
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this))
            // console.log(this.enemies)
        }
    }

    const game = new Game(canvas.width, canvas.height)
    // console.log(game)

    let lastTime = 0

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        game.update(deltaTime) // this must be before draw!
        game.draw(ctx)

        if (!game.gameOver) requestAnimationFrame(animate)
    }

    animate(0)
})
