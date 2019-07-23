var back = document.getElementById('cvs')
var ctx = back.getContext('2d')
var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight
var col_num = 5
var SIZE = ~~((WIDTH - col_num - 1) / col_num)
var GAME_SIZE = (SIZE + 1) * col_num + 1
var paddingTop = (HEIGHT - GAME_SIZE) / 2
var paddingLeft = (WIDTH - GAME_SIZE) / 2
back.width = WIDTH
back.height = HEIGHT

var board = document.createElement('canvas')
var ctx_board = board.getContext('2d')
board.width = GAME_SIZE
board.height = GAME_SIZE

var game = document.createElement('canvas')
var ctx_game = game.getContext('2d')
game.width = GAME_SIZE
game.height = GAME_SIZE

function init() {
  drawBack()
  bindEvent()
  window.requestAnimationFrame(render)
}
function drawBack() {
  ctx_board.beginPath()
  ctx_board.strokeStyle = '#666'
  ctx_board.lineWidth = 1
  for (var i = 0; i <= GAME_SIZE; i+=(SIZE + 1)) {
    ctx_board.moveTo(i, 0)
    ctx_board.lineTo(i, GAME_SIZE)
    ctx_board.stroke()
    ctx_board.moveTo(0, i)
    ctx_board.lineTo(GAME_SIZE, i)
    ctx_board.stroke()
  }
  drawDot(2, 1, 'E25E5E')
  drawDot(4, 3, 'E25E5E')
}
function drawDot(i, j, color) {
  ctx_board.beginPath()
  ctx_board.fillStyle = '#' + color
  ctx_board.arc(
    i * (SIZE + 1) + SIZE / 2,
    j * (SIZE + 1) + SIZE / 2,
    SIZE / 4, 0, 2*Math.PI)
  ctx_board.fill()
}
function drawBlock(xy) {
  ctx_game.fillStyle = 'rgba(255, 240, 240, 0.5)'
  ctx_game.fillRect(xy[0] * (SIZE + 1), xy[1] * (SIZE + 1), SIZE, SIZE)
}
function calcXY(x, y) {
  return [~~((x - paddingLeft) / (SIZE + 1)), ~~((y - paddingTop) / (SIZE + 1))]
}
function inGameSize(x, y) {
  return x > paddingLeft && x < paddingLeft + GAME_SIZE &&
    y > paddingTop && y < paddingTop + GAME_SIZE
}
function bindEvent() {
  document.addEventListener('touchstart', function (e) {
    var x = e.touches[0].pageX, y = e.touches[0].pageY
    inGameSize(x, y) && drawBlock(calcXY(x, y))
  })
  document.addEventListener('touchmove', function (e) {
    ctx_game.clearRect(0, 0, GAME_SIZE, GAME_SIZE)
    var x = e.touches[0].pageX, y = e.touches[0].pageY
    inGameSize(x, y) && drawBlock(calcXY(x, y))
  })
  document.addEventListener('touchend', function (e) {
    ctx_game.clearRect(0, 0, GAME_SIZE, GAME_SIZE)
  })
}
function render() {
  ctx.clearRect(paddingLeft, paddingTop, WIDTH, HEIGHT)
  ctx.drawImage(board, paddingLeft, paddingTop)
  ctx.drawImage(game, paddingLeft, paddingTop)
  window.requestAnimationFrame(render)
}
init()
