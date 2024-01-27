export default class UI {
    constructor(game) {
        this.game = game
        this.fontSize = 30
        this.fontFamily = 'Creepster'
        this.livesImg = lives
    }

    draw(ctx) {
        ctx.save()
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        ctx.shadowColor = 'black'
        ctx.shadowBlur = 0

        ctx.fillStyle = this.game.fontColor
        ctx.textAlign = 'left'
        ctx.font = this.fontSize + 'px ' + this.fontFamily
        ctx.fillText('Score: ' + this.game.score + '/' + this.game.winningScore, 20, 50)

        ctx.font = this.fontSize * .8 + 'px ' + this.fontFamily
        ctx.fillText('Time: ' + (this.game.maxTime * .001).toFixed(1), 20, 80)

        for (let i = 0; i < this.game.lives; i++) {
            ctx.drawImage(this.livesImg, 25 * i + 20, 95, 25, 25)
        }

        if (this.game.gameOver) {
            ctx.textAlign = 'center'
            ctx.font = this.fontSize * 2 + 'px ' + this.fontFamily
            if (this.game.score >= this.game.winningScore) {
                ctx.fillText('You Win', this.game.width * .5, this.game.height * .5 - 20)
                ctx.font = this.fontSize * .7 + 'px ' + this.fontFamily
                ctx.fillText('Press F5 to play again', this.game.width * .5, this.game.height * .5 + 20)
            } else {
                ctx.fillText('GAME OVER', this.game.width * .5, this.game.height * .5 - 20)
                ctx.font = this.fontSize * .7 + 'px ' + this.fontFamily
                ctx.fillText('Press F5 to play again', this.game.width * .5, this.game.height * .5 + 20)
            }
        }
        ctx.restore()
    }
}
