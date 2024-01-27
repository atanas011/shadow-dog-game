export default class FloatingPoints {
    constructor(value, x, y, targetX, targetY) {
        this.value = value
        this.x = x
        this.y = y
        this.targetX = targetX
        this.targetY = targetY
        this.markedForDeletion = false
        this.timer = 0
    }

    update() {
        this.x += (this.targetX - this.x) * .03
        this.y += (this.targetY - this.y) * .03
        this.timer++
        if (this.timer > 100) this.markedForDeletion = true
    }

    draw(ctx) {
        ctx.font = '20px Creepster'
        ctx.fillStyle = 'black'
        ctx.fillText(this.value, this.x, this.y)
        ctx.fillStyle = 'yellow'
        ctx.fillText(this.value, this.x - 2, this.y - 2)
    }
}
