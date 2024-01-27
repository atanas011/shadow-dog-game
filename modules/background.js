class Layer {
    constructor(game, width, height, speedFactor, img) {
        this.game = game
        this.width = width
        this.height = height
        this.speedFactor = speedFactor
        this.img = img
        this.x = 0
        this.y = 0
    }

    update() {
        this.x < -this.width ? this.x = 0 :
            this.x -= this.game.speed * this.speedFactor
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
    }
}

export default class Background {
    constructor(game) {
        this.game = game
        this.width = 1667
        this.height = 500
        this.layer1img = layer1
        this.layer2img = layer2
        this.layer3img = layer3
        this.layer4img = layer4
        this.layer5img = layer5
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1img)
        this.layer2 = new Layer(this.game, this.width, this.height, .2, this.layer2img)
        this.layer3 = new Layer(this.game, this.width, this.height, .4, this.layer3img)
        this.layer4 = new Layer(this.game, this.width, this.height, .8, this.layer4img)
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5img)
        this.bgLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5]
    }

    update() {
        this.bgLayers.forEach(l => l.update())
    }

    draw(ctx) {
        this.bgLayers.forEach(l => l.draw(ctx))
    }
}
