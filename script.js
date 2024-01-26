const ctx = canvas.getContext('2d')

canvas.width = 700
canvas.height = 500

class Explosion {
    constructor(x, y) {
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.width = this.spriteWidth * .7
        this.height = this.spriteHeight * .7
        this.x = x
        this.y = y
        this.img = new Image()
        this.img.src = 'boom.png'
        this.frame = 0
        this.timer = 0
        this.angle = Math.random() * 6.2
        this.sound = new Audio()
        this.sound.src = 'boom.wav' // opengameart.org > Browse > Sound Effects
    }

    update() {
        this.frame == 0 && this.sound.play()
        this.timer++
        this.timer % 10 == 0 && this.frame++
    }

    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.drawImage(
            this.img, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            0 - this.width / 2, 0 - this.height / 2, this.width, this.height
        )
        ctx.restore()
    }
}

let canvasPosition = canvas.getBoundingClientRect()
const explosions = []

window.addEventListener('click', e => createAnimation(e))
// window.addEventListener('mousemove', e => createAnimation(e))

function createAnimation(e) {
    let positionX = e.x - canvasPosition.left
    let positionY = e.y - canvasPosition.top
    explosions.push(new Explosion(positionX, positionY))
    // console.log(explosions)
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update()
        explosions[i].draw()
        if (explosions[i].frame > 5) {
            explosions.splice(i, 1)
            i--
        }
    }

    requestAnimationFrame(animate)
}

animate()
