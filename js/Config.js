const COLOR = [{
  fillStyle: 'lightgreen',
  strokeStyle: 'green'
}, {
  fillStyle: 'pink',
  strokeStyle: 'purple'
}, {
  fillStyle: 'yellow',
  strokeStyle: 'orange'
}, {
  fillStyle: 'blue',
  strokeStyle: 'darkblue'
}, {
  fillStyle: 'red',
  strokeStyle: 'darkred'
}]

const PIECE = [{
  spin: 1,
  squares: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 }
  ]
}, {
  spin: 2,
  squares: [
    { x: 0, y: 0 },
    { x: 1, y: 2 },
    { x: 0, y: 1 },
    { x: 1, y: 1 }
  ]
}, {
  spin: 1,
  squares: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 1 },
    { x: 1, y: 1 }
  ]
}, {
  spin: 0,
  squares: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 2, y: 0 }
  ]
}, {
  spin: 0,
  squares: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 }
  ]
}, {
  spin: 1,
  squares: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 }
  ]
}, {
  squares: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 }
  ]
}]


// Canvas
const canvas = document.getElementById('tetris')
const ctx = canvas.getContext('2d')
const columns = 10
const rows = 20

const xsize = canvas.width/columns
const ysize = canvas.height/rows

var interval, board, floating, next, fcolor, speed

function clearCanvas() {
  let color = ctx.fillStyle
  ctx.fillStyle = '#DDDDDD'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = color
}

function drawSquare({x, y, color}) {
  if(color){
      ctx.fillStyle = color.fillStyle
      ctx.strokeStyle = color.strokeStyle
  }

  ctx.fillRect(x*xsize, y*ysize, xsize, ysize)
  ctx.strokeRect(x*xsize, y*ysize, xsize, ysize)
}

function drawPiece() {
  if(!floating) return;

  ctx.fillStyle = floating.color.fillStyle
  ctx.strokeStyle = floating.color.strokeStyle

  for(s of floating.squares)
    drawSquare(s)
}

function drawBoard() {
  for(row of board)
    for(p of row)
      drawSquare(p)
}

function stepDown() {
  if(!floating) return

  for(s of floating.squares)
    s.y++
}

function stepUp() {
  if(!floating) return

  for(s of floating.squares)
    s.y--
}

function randomInt(max) {
  return Math.floor(Math.random() * max)
}

function getRandom(array, copy) {
  if(copy)
    return JSON.clone(array[randomInt(array.length)])
  else
    return array[randomInt(array.length)]
}

function newPiece() {
  let piece = getRandom(PIECE, true)
  do
    piece.color = getRandom(COLOR)
  while(fcolor == piece.color)

  fcolor = piece.color
  return piece
}

function generateNext() {
  floating = next
  next = newPiece()
}

function checkForCollision() {
  if(!floating) return false

  for(s of floating.squares){
    if(s.y >= rows)
      return true

    if(s.x < 0)
      return true

    if(s.x >= 10)
      return true
  }

  for(s of floating.squares)
    for(row of board)
      for(q of row)
        if(s.x == q.x && s.y == q.y)
          return true

  return false
}

function fixPiece() {
    if(!floating) return

    speedDown()

    for(s of floating.squares){
      s.color = floating.color
      board[s.y].push(s)
    }
}

function updateGame() {
  if(checkForCollision())
    return setup()

  stepDown()

  if(checkForCollision()) {
    stepUp()
    fixPiece()
    generateNext()
  }

  destroyLines()
}

function destroyLines(){
  for(r in board){
    if(board[board.length-r-1].length >= 10){
      board.splice(board.length-r-1, 1)
      board.unshift([])
    }

    for(s of board[r])
      s.y = r
  }
}

JSON.clone = function (json) {
  return JSON.parse(JSON.stringify(json))
}

function tick() {
  updateGame()
  clearCanvas()
  drawBoard()
  drawPiece()
}

function normalize({x, y}){
  for(s of floating.squares){
    s.x -= x
    s.y -= y
  }
}

function naturalize({x, y}){
  for(s of floating.squares){
    s.x += x
    s.y += y
  }
}

function rotateLeft(){
  let {x, y} = floating.squares[floating.spin]

  normalize({x, y})

  for(s of floating.squares){
    aux = s.x
    s.x = -s.y
    s.y = aux
  }

  naturalize({x, y})
}

function rotateRight(){
  let {x, y} = floating.squares[floating.spin]

  normalize({x, y})

  for(s of floating.squares){
    aux = s.x
    s.x = s.y
    s.y = -aux
  }

  naturalize({x, y})
}

function clearBoard(){
  board = []

  for(let i=0; i<20; i++)
    board.push([])
}

function speedDown(){
  speed = 500
  updateInterval()
}

function speedUp(){
  speed = 50
  updateInterval()
}

function moveLeft(){
  for(s of floating.squares)
    s.x--
}

function moveRight(){
  for(s of floating.squares)
    s.x++
}

function keyDown({key}){
   switch (key) {
     case 'w':
       rotateLeft()
       if(checkForCollision())
         rotateRight()
       break

     case 'a':
       moveLeft()
       if(checkForCollision())
         moveRight()
       break

     case 's':
       rotateRight()
       if(checkForCollision())
         rotateLeft()
       break
a
     case 'd':
       moveRight()
       if(checkForCollision())
         moveLeft()
       break

     case ' ':
       speedUp()
       break
   }

   clearCanvas()
   drawBoard()
   drawPiece()
}

function updateInterval(){
  if(interval)
    clearInterval(interval)

  interval = setInterval(tick, speed)
}

function setup() {
  clearBoard()
  speedDown()

  generateNext()
  generateNext()

  window.addEventListener( "keypress", keyDown, false )
}

setup()
