window.addEventListener('load', () => {
    const ctx = canvas.getContext('2d')
    canvas.width = 1400
    canvas.height = 720

    // =================================================================================== CONTROLS
    class InputHandler {
        constructor() {
            this.keys = []
            window.addEventListener('keydown', e => {
                // console.log(e)
                if ((
                    e.key == 'ArrowDown' ||
                    e.key == 'ArrowUp' ||
                    e.key == 'ArrowLeft' ||
                    e.key == 'ArrowRight') &&
                    !this.keys.includes(e.key)) {
                    this.keys.push(e.key)
                }
                // console.log(e.key, this.keys)
                if (e.key == 'Enter' && gameOver) restartGame()
            })

            window.addEventListener('keyup', e => {
                if ((
                    e.key == 'ArrowDown' ||
                    e.key == 'ArrowUp' ||
                    e.key == 'ArrowLeft' ||
                    e.key == 'ArrowRight')) {
                    this.keys.splice(this.keys.indexOf(e.key), 1)
                }
                // console.log(e.key, this.keys)
            })

            // ===================================================================== MOBILE SUPPORT
            this.touchY = ''
            this.touchTreshold = 30 // swipe length

            window.addEventListener('touchstart', e => {
                // console.log(e)
                this.touchY = e.changedTouches[0].pageY
            })

            window.addEventListener('touchmove', e => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY
                if (swipeDistance < -this.touchTreshold && !this.keys.includes('swipe up')) this.keys.push('swipe up')
                if (swipeDistance > this.touchTreshold && !this.keys.includes('swipe down')) {
                    this.keys.push('swipe down')
                    gameOver && restartGame()
                }
            })

            window.addEventListener('touchend', e => {
                this.keys.splice(this.keys.indexOf('swipe up'), 1)
                this.keys.splice(this.keys.indexOf('swipe down'), 1)
            })
        }
    }

    // ===================================================================================== PLAYER
    let gameOver = false

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 200
            this.height = 200
            this.x = 100
            this.y = this.gameHeight - this.height
            this.img = playerImg
            this.frameX = 0
            this.frameY = 0
            this.speed = 0
            this.vy = 0
            this.weight = 1
            this.maxFrame = 8
            this.fps = 100
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps
        }

        draw(ctx) {
            // // hitbox
            // ctx.lineWidth = 3
            // ctx.strokeStyle = 'white'
            // ctx.beginPath()
            // ctx.arc(this.x + this.width / 2, this.y + this.height / 2 + 20, this.width / 3, 0, Math.PI * 2)
            // ctx.stroke()

            ctx.drawImage(
                this.img, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                this.x, this.y, this.width, this.height
            )
        }

        update(enemies, deltaTime, input) {
            // collision detection
            enemies.forEach(e => {
                const dx = (e.x + e.width / 2 - 20) - (this.x + this.width / 2)
                const dy = (e.y + e.height / 2) - (this.y + this.height / 2 + 20)
                const distance = Math.sqrt(dx * dx + dy * dy)
                if (distance < e.width / 3 + this.width / 3) gameOver = true
            })

            // sprite animation
            if (this.frameTimer > this.frameInterval) {
                (this.frameX >= this.maxFrame) ? this.frameX = 0 : this.frameX++
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }

            // controls
            this.speed = input.keys.includes('ArrowRight') ?
                20 : input.keys.includes('ArrowLeft') ? -20 : 0
            if ((input.keys.includes('ArrowUp') ||
                input.keys.includes('swipe up')) &&
                this.isOnGround()
            ) this.vy -= 30

            // horizontal movement
            this.x += this.speed
            if (this.x < 0) this.x = 0
            if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width

            // vertical movement
            this.y += this.vy
            if (!this.isOnGround()) {
                this.vy += this.weight
                this.maxFrame = 5
                this.frameY = 1
            } else {
                this.vy = 0
                // this.maxFrame = 8
                this.frameY = 0
            }

            // if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }

        isOnGround() {
            return this.y >= this.gameHeight - this.height
        }

        restart() {
            this.x = 100
            this.y = this.gameHeight - this.height
            this.maxFrame = 8
            this.frameY = 0
        }
    }

    // ================================================================================= BACKGROUND
    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 2400
            this.height = 720
            this.x = 0
            this.y = 0
            this.img = backgroundImg
            this.speed = 5
        }

        draw(ctx) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
            ctx.drawImage(this.img, this.x + this.width - 1, this.y, this.width, this.height)
        }

        update() {
            this.x -= this.speed // -5px/frame
            if (this.x < 0 - this.width) this.x = 0
        }

        restart() {
            this.x = 0
        }
    }

    // ====================================================================================== ENEMY
    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 160
            this.height = 119
            this.x = this.gameWidth
            this.y = this.gameHeight - this.height
            this.img = enemyImg
            this.frameX = 0
            this.speed = 8
            this.maxFrame = 5
            this.fps = 20
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps
            this.markedForDeletion = false
        }

        draw(ctx) {
            // // hitbox
            // ctx.lineWidth = 3
            // ctx.strokeStyle = 'white'
            // ctx.beginPath()
            // ctx.arc(this.x + this.width / 2 - 20, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2)
            // ctx.stroke()

            ctx.drawImage(
                this.img, this.frameX * this.width, 0, this.width, this.height,
                this.x, this.y, this.width, this.height
            )
        }

        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                (this.frameX >= this.maxFrame) ? this.frameX = 0 : this.frameX++
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }

            this.x -= this.speed

            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
                score++
            }
        }
    }

    // ============================================================================= HANDLE ENEMIES
    let enemies = []
    let enemyTimer = 0
    let enemyInterval = 1000
    let randomEnemyInterval = Math.random() * 1000 + 500

    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height))
            // console.log(enemies)
            randomEnemyInterval = Math.random() * 1000 + 500
            enemyTimer = 0
        } else {
            enemyTimer += deltaTime
        }

        enemies.forEach(e => {
            e.draw(ctx)
            e.update(deltaTime)
        })
        enemies = enemies.filter(e => !e.markedForDeletion)
    }

    // =============================================================================== DISPLAY TEXT
    let score = 0

    function displayStatusTxt(ctx) {
        ctx.font = '40px Arial Black'
        ctx.textAlign = 'left'
        ctx.fillStyle = 'black'
        ctx.fillText('Score: ' + score, 20, 50)
        ctx.fillStyle = 'yellow'
        ctx.fillText('Score: ' + score, 23, 53)

        if (gameOver) {
            ctx.textAlign = 'center'
            ctx.fillStyle = 'black'
            ctx.fillText('GAME OVER', canvas.width / 2, 210)
            ctx.fillStyle = 'red'
            ctx.fillText('GAME OVER', canvas.width / 2 + 3, 213)

            ctx.fillStyle = 'black'
            ctx.font = '30px Arial Black'
            ctx.fillText('Press Enter to play again', canvas.width / 2, 260)
            ctx.fillStyle = 'yellow'
            ctx.fillText('Press Enter to play again', canvas.width / 2 + 3, 263)
        }
    }

    // ======================================================================= RESTART & FULLSCREEN
    function restartGame() {
        player.restart()
        background.restart()
        enemies = []
        score = 0
        gameOver = false
        animate(0)
    }

    function toggleFullscreen() {
        // console.log(document.fullscreenElement)
        !document.fullscreenElement ?
            canvas.requestFullscreen().catch(err => alert(`Can't toggle fullscreen: ${err.message}`)) :
            document.exitFullscreen()
    }
    fullscreenBtn.addEventListener('click', toggleFullscreen)

    // ================================================================================== ANIMATION
    const input = new InputHandler()
    const player = new Player(canvas.width, canvas.height)
    const background = new Background(canvas.width, canvas.height)
    // const enemy = new Enemy(canvas.width, canvas.height)

    let lastTime = 0

    function animate(timeStamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp

        background.draw(ctx)
        background.update()
        player.draw(ctx)
        player.update(enemies, deltaTime, input)
        // enemy.draw(ctx)
        // enemy.update()
        handleEnemies(deltaTime)
        displayStatusTxt(ctx)

        if (!gameOver) requestAnimationFrame(animate)
    }

    animate(0)
})
