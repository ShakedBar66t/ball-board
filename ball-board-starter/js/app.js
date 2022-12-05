'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src ="img/glue.png">'

// Model:
var gBoard
var gGamerPos
var gGameInterval
var gBallCounter = 0
var gGlueInterval

function onInitGame() {
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGameInterval = setInterval(addBall, 2500)
    gGlueInterval = setInterval(addGlue, 5000)
}


function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
        }
    }
    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL
    board[0][6].type = FLOOR
    board[5][0].type = FLOOR
    board[9][6].type = FLOOR
    board[5][11].type = FLOOR


    // console.log(board)
    return board
}

// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            } else if (currCell.gameElement === GLUE){
                strHTML += GLUE_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {
    let isWin = false
    if (i === -1) i = gBoard.length - 1
    if (i === gBoard.length) i = 0
    if (j === -1) j = gBoard[i].length - 1
    if (j === gBoard[i].length) j = 0
    // console.log(i, j);
    const targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    // Calculate distance to make sure we are moving to a neighbor cell
    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    // if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {


        if (targetCell.gameElement === BALL) {
            // debugger
            gBallCounter++
            playSound()
            renderCounter()
        }
        isWin = checkWin(gBoard)
        // console.log(isWin);
        // DONE: Move the gamer
        // REMOVING FROM
        // update Model
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // update DOM
        renderCell(gGamerPos, '')

        // ADD TO
        // update Model
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        // update DOM
        renderCell(gGamerPos, GAMER_IMG)
    // }



    if (isWin) onWin()


}

function renderCounter() {
    const elCounter = document.querySelector('span')
    // console.log('Elcounter', elCounter);
    elCounter.innerText = gBallCounter


}
// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function getEmptyCells(board) {
    const emptyCells = []
    for (let i = 1; i < board.length - 1; i++) {
        for (let j = 1; j < board[i].length - 1; j++) {
            const cell = board[i][j]
            if (cell.gameElement === null) emptyCells.push({ i, j })

        }
    }
    return emptyCells
}


function checkWin(board) {
    for (let i = 1; i < board.length - 1; i++) {
        for (let j = 1; j < board[i].length - 1; j++) {
            const cell = board[i][j]
            // console.log(cell.gameElement);
            if (cell.gameElement === BALL) return false
        }
    }
    return true
}

function onWin() {
    clearInterval(gGameInterval)
    alert('winner')
}

function addBall() {
    const emptyCells = getEmptyCells(gBoard)
    // console.log('emptyCells', emptyCells);
    const randIdx = getRandomInt(0, emptyCells.length)
    const location = emptyCells[randIdx]
    // console.log('location', location);
    const { i, j } = location
    // console.log(board[i][j])
    gBoard[i][j].gameElement = BALL
    renderBoard(gBoard)

    if (emptyCells.length === 0) return
}

// Move the player by keyboard arrows
function onHandleKey(event) {
    const i = gGamerPos.i
    const j = gGamerPos.j
    // console.log('event.key:', event)

    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            moveTo(i, j + 1)
            break
        case 'ArrowUp':
            moveTo(i - 1, j)
            break
        case 'ArrowDown':
            moveTo(i + 1, j)
            break
    }
}

function onReset() {
    onInitGame()
}

function addGlue(){
    const emptyCells = getEmptyCells(gBoard)
    const randIdx = getRandomInt(0, emptyCells.length)
    const location = emptyCells[randIdx]
    const { i, j } = location
    gBoard[i][j].gameElement = GLUE
    setTimeout(()=>{
        gBoard[i][j].gameElement = null
        renderBoard(gBoard)
    }, 3000)
    renderBoard(gBoard)
    // console.log('hello');


}

// playSound()

function playSound() {
    var sound = new Audio('sounds/01.wav');
    sound.play();
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}