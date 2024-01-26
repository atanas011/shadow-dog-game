const ctx1 = canvas1.getContext('2d')
const ctx2 = canvas2.getContext('2d')
const ctx3 = canvas3.getContext('2d')
const ctx4 = canvas4.getContext('2d')

canvas1.width = canvas2.width = canvas3.width = canvas4.width = 267
canvas1.height = canvas2.height = canvas3.height = canvas4.height = 497

function random(num) {
    return Math.random() * num
}

// ==================================================================================== ENEMY CLASS
class Enemy {
    constructor(src, width, height, canvas, ctx, angleSpeed, angle) {
        this.img = new Image()
        this.img.src = src
        this.speed = random(4) + 1
        this.width = width / 4
        this.height = height / 4
        this.canvas = canvas
        this.ctx = ctx
        this.x = random(canvas.width - this.width)
        this.y = random(canvas.height - this.height)
        this.newX = random(canvas.width)
        this.newY = random(canvas.height)
        this.frame = 0
        this.flapSpeed = Math.floor(random(3) + 1) // random num between 1 and 4
        this.angleSpeed = angleSpeed
        this.curve = random(8)
        this.angle = angle
        this.interval = Math.floor(random(200) + 50)
    }

    flap() {
        if (gameFrame % this.flapSpeed == 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++
        }
    }

    update1() {
        this.x += random(5) - 2.5
        this.y += random(5) - 2.5
        this.flap()
    }

    update2() {
        this.x -= this.speed
        this.y += this.curve * Math.sin(this.angle)
        this.angle += this.angleSpeed
        if (this.x + this.width < 0) this.x = this.canvas.width
        this.flap()
    }

    update3() {
        this.x = this.canvas.width / 2 * Math.cos(this.angle * Math.PI / 200) + (this.canvas.width / 2 - this.width / 2)
        this.y = this.canvas.height / 2 * Math.sin(this.angle * Math.PI / 300) + (this.canvas.height / 2 - this.height / 2)
        this.angle += this.angleSpeed
        if (this.x + this.width < 0) this.x = this.canvas.width
        this.flap()
    }

    update4() {
        if (gameFrame % this.interval == 0) {
            this.newX = random(this.canvas.width - this.width)
            this.newY = random(this.canvas.height - this.height)
        }
        let dx = this.x - this.newX
        let dy = this.y - this.newY
        this.x -= dx / 20
        this.y -= dy / 20
        if (this.x + this.width < 0) this.x = this.canvas.width
        this.flap()
    }

    draw() {
        // this.ctx.strokeRect(this.x, this.y, this.width, this.height)
        this.ctx.drawImage(
            this.img, this.frame * this.width * 4, 0, this.width * 4, this.height * 4,
            this.x, this.y, this.width, this.height
        )
    }
}

// ========================================================================= CREATE AND ADD ENEMIES
const numOfEnemies = 20
const enemies1 = []
const enemies2 = []
const enemies3 = []
const enemies4 = []

for (let i = 0; i < numOfEnemies; i++) {
    enemies1.push(new Enemy('enemies/enemy1.png', 293, 155, canvas1, ctx1))
    enemies2.push(new Enemy('enemies/enemy2.png', 266, 188, canvas2, ctx2, random(.2), 0))
    enemies3.push(new Enemy('enemies/enemy3.png', 218, 177, canvas3, ctx3, random(.5) + .5, random(500)))
    enemies4.push(new Enemy('enemies/enemy4.png', 213, 212, canvas4, ctx4))
}

// ======================================================================================== ANIMATE
let gameFrame = 0

function animate() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
    enemies1.forEach(e => {
        e.update1()
        e.draw()
    })
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
    enemies2.forEach(e => {
        e.update2()
        e.draw()
    })
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height)
    enemies3.forEach(e => {
        e.update3()
        e.draw()
    })
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height)
    enemies4.forEach(e => {
        e.update4()
        e.draw()
    })
    gameFrame++
    requestAnimationFrame(animate)
}

animate()
