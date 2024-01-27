window.addEventListener('load', () => {
    const ctx = canvas.getContext('2d')

    canvas.width = 1070
    canvas.height = 500

    function random(num) {
        return Math.random() * num
    }

    // ======================================================================================= GAME
    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx
            this.width = width
            this.height = height
            this.enemies = []
            this.enemyInterval = 500
            this.enemyTimer = 0
            this.enemyTypes = ['worm', 'ghost', 'spider']
        }

        update(deltaTime) {
            this.enemies = this.enemies.filter(e => !e.markedForDeletion)

            if (this.enemyTimer > this.enemyInterval) {
                this.#addNewEnemy()
                this.enemyTimer = 0
            } else {
                this.enemyTimer += deltaTime
            }

            this.enemies.forEach(e => e.update(deltaTime))
        }

        draw() {
            this.enemies.forEach(e => e.draw(this.ctx))
        }

        #addNewEnemy() { // private method (visible only inside this class)
            const randomEnemy = this.enemyTypes[Math.floor(random(this.enemyTypes.length))]
            if (randomEnemy == 'worm') this.enemies.push(new Worm(this))
            if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this))
            if (randomEnemy == 'spider') this.enemies.push(new Spider(this))
            // console.log(this.enemies)

            // this.enemies.sort((a, b) => { return a.y - b.y })
        }
    }

    // ====================================================================================== ENEMY
    class Enemy {
        constructor(game) {
            this.game = game
            this.markedForDeletion = false
            this.frameX = 0
            this.maxFrame = 5
            this.frameInterval = 100
            this.frameTimer = 0
        }

        update(deltaTime) {
            this.x -= this.vx * deltaTime
            if (this.x < 0 - this.width) this.markedForDeletion = true
            if (this.frameTimer > this.frameInterval) {
                (this.frameX < this.maxFrame) ? this.frameX++ : this.frameX = 0 // () user friendly!
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }
        }

        draw(ctx) {
            // ctx.strokeRect(this.x, this.y, this.width, this.height)
            ctx.drawImage(
                this.img,
                this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.width, this.height
            )
        }
    }

    // ======================================================================================= WORM
    class Worm extends Enemy {
        constructor(game) {
            super(game)
            this.spriteWidth = 229
            this.spriteHeight = 171
            this.width = this.spriteWidth / 2
            this.height = this.spriteHeight / 2
            this.x = this.game.width
            this.y = this.game.height - this.height
            this.img = worm // id="worm" from index.html
            this.vx = random(.1) + .1
        }
    }

    // ====================================================================================== GHOST
    class Ghost extends Enemy {
        constructor(game) {
            super(game)
            this.spriteWidth = 261
            this.spriteHeight = 209
            this.width = this.spriteWidth / 2
            this.height = this.spriteHeight / 2
            this.x = this.game.width
            this.y = random(this.game.height) * .6
            this.img = ghost
            this.vx = random(.2) + .1
            this.angle = 0
            this.curve = random(3)
        }

        update(deltaTime) {
            super.update(deltaTime)
            this.y += Math.sin(this.angle) * this.curve
            this.angle += .04
        }

        draw(ctx) {
            ctx.save()
            ctx.globalAlpha = .5
            super.draw(ctx)
            ctx.restore()
        }
    }

    // ===================================================================================== SPIDER
    class Spider extends Enemy {
        constructor(game) {
            super(game)
            this.spriteWidth = 310
            this.spriteHeight = 175
            this.width = this.spriteWidth / 2
            this.height = this.spriteHeight / 2
            this.x = random(this.game.width)
            this.y = 0 - this.height
            this.img = spider
            this.vx = 0
            this.vy = random(.1) + .1
            this.maxLength = random(this.game.height)
        }

        update(deltaTime) {
            super.update(deltaTime)
            if (this.y < 0 - this.height * 2) this.markedForDeletion = true
            this.y += this.vy * deltaTime
            if (this.y > this.maxLength) this.vy *= -1
        }

        draw(ctx) {
            ctx.beginPath()
            ctx.moveTo(this.x + this.width / 2, 0)
            ctx.lineTo(this.x + this.width / 2, this.y + 10)
            ctx.stroke()
            super.draw(ctx)
        }
    }

    // ================================================================================== ANIMATION
    let lastTime = 1
    const game = new Game(ctx, canvas.width, canvas.height)

    function animate(timeStamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp

        game.update(deltaTime)
        game.draw()

        requestAnimationFrame(animate)
    }

    animate(0)
})
