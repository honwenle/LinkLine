// 尺寸规格
var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight
var level = 0
var col_num = levelData[level]['col']
var level_dots = levelData[level]['dot']
var line_num = level_dots.length
var SIZE = ~~((WIDTH - col_num - 1) / col_num)
var GAME_SIZE = (SIZE + 1) * col_num + 1
var paddingTop = (HEIGHT - GAME_SIZE) / 2
var paddingLeft = (WIDTH - GAME_SIZE) / 2
// 游戏变量
var can_play = true
var line_arr = Array(line_num)
var all = {}
var current_id = undefined
var current_line = undefined
// 整体画布
var back = document.getElementById('cvs')
var ctx = back.getContext('2d')
back.width = WIDTH
back.height = HEIGHT
// 底盘画布
var board = document.createElement('canvas')
var ctx_board = board.getContext('2d')
board.width = GAME_SIZE
board.height = GAME_SIZE
// 交互画布
var game = document.createElement('canvas')
var ctx_game = game.getContext('2d')
game.width = GAME_SIZE
game.height = GAME_SIZE
// 初始化
function init() {
  drawBack()
  initData()
  bindEvent()
  render()
}
// 初始化数据
function initData() {
  for (var i = 0; i < line_num; i++) {
    line_arr[i] = []
    all[level_dots[i][0]] = i
    all[level_dots[i][1]] = i
    drawDot(level_dots[i][0], 'E25E5E')
    drawDot(level_dots[i][1], 'E25E5E')
  }
}
// 画棋盘
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
}
// 画点
function drawDot(id, color) {
  var [x, y] = id2xy(id)
  ctx_board.beginPath()
  ctx_board.fillStyle = '#' + color
  ctx_board.arc(
    x * (SIZE + 1) + SIZE / 2,
    y * (SIZE + 1) + SIZE / 2,
    SIZE / 4, 0, 2*Math.PI)
  ctx_board.fill()
}
// 画虚格
function drawBlock(id) {
  var [x, y] = id2xy(id)
  ctx_game.fillStyle = 'rgba(255, 240, 240, 0.5)'
  ctx_game.fillRect(x * (SIZE + 1), y * (SIZE + 1), SIZE, SIZE)
}
// 计算返回行列
function calcID(e) {
  var x = e.touches[0].pageX, y = e.touches[0].pageY
  if (x < paddingLeft || x >= paddingLeft + GAME_SIZE - 1 ||
    y < paddingTop || y > paddingTop + GAME_SIZE) {
    can_play = false
    return 'no'
  }
  return xy2id(~~((x - paddingLeft) / (SIZE + 1)), ~~((y - paddingTop) / (SIZE + 1)))
}
function id2xy(id) {
  return [id%10, ~~(id/10)]
}
function xy2id(x, y) {
  return x+y*10
}
// 事件绑定
function bindEvent() {
  document.addEventListener('touchstart', handleTouchStart, {passive: false})
  document.addEventListener('touchmove', handleTouch, {passive: false})
  document.addEventListener('touchend', function (e) {
    can_play = true
  })
}
// 触摸事件处理
function handleTouchStart(e) {
  var id = calcID(e)
  if (all[id] !== undefined) {
    // todo: 另一头起点
    deleteSlice(id)
    line_arr[all[id]].push(id)
    current_id = id
    current_line = all[current_id]
  } else {
    can_play = false
  }
}
function handleTouch(e) {
  e.preventDefault()
  var id = calcID(e)
  if (can_play) {
    if (id !== current_id) {
      // todo: 不能穿过别的初始点
      // todo: 穿过别线清除别线数组
      // todo: 斜角问题
      if (all[id] !== undefined) {
        deleteSlice(id)
      }
      all[id] = current_line
      line_arr[current_line].push(id)
      current_id = id
    }
  }
}
function deleteSlice(id) {
  var idx = line_arr[all[id]].indexOf(id)
  if (idx >= -1) {
    delete_arr = line_arr[all[id]].splice(idx, line_arr[all[id]].length)
    delete_arr.shift()
    delete_arr.forEach(id => {
      delete all[id]
    })
  }
}
// 画所有格子
function drawGame() {
  ctx_game.clearRect(0, 0, GAME_SIZE, GAME_SIZE)
  for (var i = 0; i < line_num; i++)  {
    line_arr[i].forEach(block => {
      drawBlock(block)
      // todo: 画连接线
    })
  }
}
// 渲染画布
function render() {
  ctx.clearRect(paddingLeft, paddingTop, WIDTH, HEIGHT)
  ctx.drawImage(board, paddingLeft, paddingTop)
  drawGame()
  ctx.drawImage(game, paddingLeft, paddingTop)
  window.requestAnimationFrame(render)
}
init()
