const ctx = canvas.getContext('2d') // by default: e.g. canvas = document.getElementById('canvas')

canvas.width = 800
canvas.height = 500

const bgLayer1 = new Image()
bgLayer1.src = 'city/layer-1.png'
const bgLayer2 = new Image()
bgLayer2.src = 'city/layer-2.png'
const bgLayer3 = new Image()
bgLayer3.src = 'city/layer-3.png'
const bgLayer4 = new Image()
bgLayer4.src = 'city/layer-4.png'
const bgLayer5 = new Image()
bgLayer5.src = 'city/layer-5.png'

let gameSpeed = 5 // px per frame

// if source code is hosted online, wait for all elements to load in browser before start
window.addEventListener('load', () => {

    class Layer {
        constructor(img, speedFactor) {
            this.x = 0
            this.y = 0
            this.width = 1667
            this.height = 500
            this.img = img
            this.speedFactor = speedFactor
            this.speed = gameSpeed * this.speedFactor
        }

        update() {
            this.speed = gameSpeed * this.speedFactor
            this.x <= -this.width ? this.x = 0 : this.x = Math.floor(this.x - this.speed)
        }

        draw() {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
            ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
        }
    }

    const layer1 = new Layer(bgLayer1, .2) // .2 x gameSpeed
    const layer2 = new Layer(bgLayer2, .4)
    const layer3 = new Layer(bgLayer3, .6)
    const layer4 = new Layer(bgLayer4, .8)
    const layer5 = new Layer(bgLayer5, 1)

    const layers = [layer1, layer2, layer3, layer4, layer5]

    slider.value = gameSpeed
    showGameSpeed.innerHTML = gameSpeed
    slider.addEventListener('change', e => {
        gameSpeed = e.target.value
        showGameSpeed.innerHTML = gameSpeed
    })

    function animate() {
        ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2)
        layers.forEach(e => {
            e.update()
            e.draw()
        })
        requestAnimationFrame(animate)
    }

    animate()
})
