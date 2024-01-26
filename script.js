/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
// console.log(ctx)

// default is 300x150
canvas.width = 300
canvas.height = 480

const playerImg = new Image()
playerImg.src = 'dog.png'
const spriteWidth = 100 // 1200/12
const spriteHeight = 91.3 // 913/10

let gameFrame = 0
const slowDown = 2

const spriteAnimations = []
const animationStates = [
    {
        name: 'idle',
        frames: 7
    },
    {
        name: 'jump',
        frames: 7
    },
    {
        name: 'fall',
        frames: 7
    },
    {
        name: 'run',
        frames: 9
    },
    {
        name: 'dizzy',
        frames: 11
    },
    {
        name: 'sit',
        frames: 5
    },
    {
        name: 'roll',
        frames: 7
    },
    {
        name: 'bite',
        frames: 7
    },
    {
        name: 'ko',
        frames: 12
    },
    {
        name: 'gethit',
        frames: 4
    }
]

animationStates.forEach((state, i) => {
    let frames = { loc: [] }

    for (let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth
        let positionY = i * spriteHeight
        frames.loc.push({ x: positionX, y: positionY })
    }
    spriteAnimations[state.name] = frames
})

let playerState = 'idle'
const dropdown = document.getElementById('animations')
dropdown.addEventListener('change', e => playerState = e.target.value)

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let position = Math.floor(gameFrame / slowDown) % spriteAnimations[playerState].loc.length
    let frameX = position * spriteWidth
    let frameY = spriteAnimations[playerState].loc[position].y
    ctx.drawImage(
        playerImg, frameX, frameY, spriteWidth, spriteHeight, // source (png)
        canvas.width * .3, canvas.height - spriteHeight, spriteWidth, spriteHeight // destination (canvas)
    )
    gameFrame++
    requestAnimationFrame(animate)
}

animate()
