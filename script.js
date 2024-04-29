const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const audio = new Audio('assets_audio.mp3')

const scoreValue = document.querySelector('.score_value');
const scoreFinal = document.querySelector('.score_value_over')
const menuScreen = document.getElementById('menu_screen')
const bntPlay = document.querySelector('.btn_play')

const size = 30

let snake = [ 
    {x: 270, y:240}
]

const incrementScore = () => {
    scoreValue.innerHTML = +scoreValue.innerHTML + 10
}


let direction, loopId

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)
    
    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor( )
}

const drawFood = () => {

    const {x, y, color} = food

    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const checkEat = () => {
    
    const head = snake[snake.length - 1]
    

    if(head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }
        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const drawSnake = () => {
    ctx.fillStyle = 'rgb(193, 195, 197)'
    
    snake.forEach( (position, index) => {

        if(index == snake.length - 1) {
            ctx.fillStyle = 'rgb(184, 184, 184)'
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if(!direction) return
    const head = snake[snake.length - 1]

    snake.shift()

    if(direction == 'right'){
        snake.push({x: head.x + size, y: head.y})
    } 
    if(direction == 'left'){
        snake.push({x: head.x - size, y: head.y})
    }
    if(direction == 'down'){
        snake.push({x: head.x, y: head.y + size})
    }
    if(direction == 'up'){
        snake.push({x: head.x, y: head.y - size})
    }
    
}

const drawLine = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "rgb(42, 42, 42)"

    for (let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }

    
}

const checkCollision = () => {
    const head = snake[snake.length -1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wall = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfColisson = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wall || selfColisson){
        gameOver()
    }

}
const gameOver = () => {
    direction = undefined

    menuScreen.style.display = 'flex'
    
    scoreFinal.innerHTML = scoreValue.innerHTML
    canvas.style.filter = 'blur(4px)'
}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)

    drawLine()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()
    

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()

document.addEventListener('keydown', ({ key }) => {
    if(key == 'ArrowRight' && direction != 'left') {
        direction = 'right'
    }
    if(key == 'ArrowLeft' && direction != 'right') {
        direction = 'left'
    }
    if(key == 'ArrowDown' && direction != 'up') {
        direction = 'down'
    }
    if(key == 'ArrowUp' && direction != 'down') {
        direction = 'up'
    }
    
})

bntPlay.addEventListener('click', function(){
    scoreValue.innerHTML = '00'
    menuScreen.style.display = 'none'
    canvas.style.filter = 'none'

    snake = [{x: 270, y:240}]
})

