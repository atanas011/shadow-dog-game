const ctx = canvas.getContext('2d')

// prevents error: Failed to execute 'getImageData' on 'CanvasRenderingContext2D':
// The canvas has been tainted by cross-origin data
const collisionCtx = collisionCanvas.getContext('2d', { willReadFrequently: true })

canvas.width = collisionCanvas.width = window.innerWidth
canvas.height = collisionCanvas.height = window.innerHeight

function random(num) {
    return Math.random() * num
}

let gameOver = false
let particles = []

// ========================================================================================== RAVEN
class Raven {
    constructor() {
        this.spriteWidth = 271
        this.spriteHeight = 194
        this.sizeFactor = random(.5) + .2
        this.width = this.spriteWidth * this.sizeFactor
        this.height = this.spriteHeight * this.sizeFactor
        this.x = canvas.width
        this.y = random(canvas.height - this.height)
        this.directionX = random(5) + 3
        this.directionY = random(5) - 2.5
        this.markedForDeletion = false
        this.img = new Image()
        this.img.src = 'resources/raven.png'
        this.frame = 0
        this.maxFrame = 4
        this.timeSinceFlap = 0
        this.flapInterval = random(50) + 50
        this.randomColors = [Math.floor(random(255)), Math.floor(random(255)), Math.floor(random(255))]
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'
        this.hasTrail = random(1) > .5 // 50% of ravens' flock
    }

    update(deltaTime) {
        if (this.y < 0 || this.y > canvas.height - this.height) this.directionY *= -1
        this.x -= this.directionX
        this.y += this.directionY
        if (this.x < 0 - this.width) this.markedForDeletion = true
        this.timeSinceFlap += deltaTime
        if (this.timeSinceFlap > this.flapInterval) {
            this.frame > this.maxFrame ? this.frame = 0 : this.frame++
            this.timeSinceFlap = 0
            if (this.hasTrail) {
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particle(this.x, this.y, this.width, this.color))
                }
            }
        }
        if (this.x < 0 - this.width) gameOver = true
    }

    draw() {
        collisionCtx.fillStyle = this.color
        collisionCtx.fillRect(this.x, this.y, this.width, this.height)
        // ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(
            this.img, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height
        )
    }
}

// ====================================================================================== EXPLOSION
class Explosion {
    constructor(x, y, size) {
        this.img = new Image()
        this.img.src = 'resources/boom.png'
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.x = x
        this.y = y
        this.size = size
        this.frame = 0
        this.sound = new Audio()
        this.sound.src = 'resources/boom.wav'
        this.timeSinceLastFrame = 0
        this.frameInterval = 200
        this.markedForDeletion = false
    }

    update(deltaTime) {
        this.frame == 0 && this.sound.play()
        this.timeSinceLastFrame += deltaTime
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++
            this.timeSinceLastFrame = 0
            if (this.frame > 5) this.markedForDeletion = true
        }
    }

    draw() {
        ctx.drawImage(
            this.img,
            this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y - this.size / 4, this.size, this.size
        )
    }
}

// ======================================================================================= PARTICLE
class Particle {
    constructor(x, y, size, color) {
        this.size = size
        this.x = x + this.size / 2 + random(50) - 25
        this.y = y + this.size / 3 + random(50) - 25
        this.radius = random(this.size / 10)
        this.maxRadius = random(20) + 35
        this.markedForDeletion = false
        this.speedX = random(1) + .5
        this.color = color
    }

    update() {
        this.x += this.speedX
        this.radius += .5
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = 1 - this.radius / this.maxRadius
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }
}

// ===================================================================================== WRITE TEXT
let score = 0
ctx.font = '35px Arial Black'

function drawScore() {
    ctx.fillStyle = 'black'
    ctx.fillText('Score: ' + score, 29, 54)
    ctx.fillStyle = 'yellow'
    ctx.fillText('Score: ' + score, 25, 50)
}

function drawGameOver() {
    ctx.textAlign = 'center'
    ctx.font = '60px  Arial Black'
    ctx.fillStyle = 'black'
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2)
    ctx.fillStyle = 'red'
    ctx.fillText('GAME OVER', canvas.width / 2 - 5, canvas.height / 2 - 5)
    ctx.font = '30px  Arial Black'
    ctx.fillStyle = 'black'
    ctx.fillText('Press F5 to play again', canvas.width / 2, canvas.height / 2 + 50)
    ctx.fillStyle = 'yellow'
    ctx.fillText('Press F5 to play again', canvas.width / 2 - 3, canvas.height / 2 + 47)
}

// ================================================================================== CLICK HANDLER
let explosions = []

window.addEventListener('click', e => {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1)
    // console.log(detectPixelColor)
    const pixelColor = detectPixelColor.data

    ravens.forEach(r => {
        if (r.randomColors[0] == pixelColor[0] &&
            r.randomColors[1] == pixelColor[1] &&
            r.randomColors[2] == pixelColor[2]) {
            // collision detected
            r.markedForDeletion = true
            score++
            explosions.push(new Explosion(r.x, r.y, r.width))
            // console.log(explosions)
        }
    })
})

// ====================================================================================== ANIMATION
let timeToNextRaven = 0
let ravenInterval = 500
let lastTime = 0

let ravens = []

function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height)
    let deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    // console.log(timeStamp)
    timeToNextRaven += deltaTime
    // console.log(deltaTime)

    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven())
        timeToNextRaven = 0
        // console.log(ravens)
        ravens.sort((a, b) => { return a.width - b.width })
    }

    [...particles, ...ravens, ...explosions].forEach(r => r.update(deltaTime));
    [...particles, ...ravens, ...explosions].forEach(r => r.draw())

    drawScore();

    ravens = ravens.filter(r => !r.markedForDeletion)
    explosions = explosions.filter(e => !e.markedForDeletion)
    particles = particles.filter(p => !p.markedForDeletion)
    // console.log(ravens)

    !gameOver ? requestAnimationFrame(animate) : drawGameOver()
}

animate(0)
