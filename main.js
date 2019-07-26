// 尺寸规格
var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight
var level = 0
var col_num, level_dots, line_num, SIZE, GAME_SIZE, paddingTop, paddingLeft
// 游戏变量
var line_arr, all, dots
var can_play = true
var current_id = undefined
var current_line = undefined
var fingerX, fingerY
// 整体画布
var back = document.getElementById('cvs')
var ctx = back.getContext('2d')
// 底盘画布
var board = document.createElement('canvas')
var ctx_board = board.getContext('2d')
// 交互画布
var game = document.createElement('canvas')
var ctx_game = game.getContext('2d')
// 初始化
function init() {
  initSize()
  drawBack()
  initData()
}
// 初始化数据
function initSize() {
  col_num = levelData[level]['col']
  level_dots = levelData[level]['dot']
  line_num = level_dots.length
  SIZE = ~~((WIDTH - col_num - 1) / col_num)
  GAME_SIZE = (SIZE + 1) * col_num + 1
  paddingTop = (HEIGHT - GAME_SIZE) / 2
  paddingLeft = (WIDTH - GAME_SIZE) / 2
  back.width = WIDTH
  back.height = HEIGHT
  board.width = GAME_SIZE
  board.height = GAME_SIZE
  game.width = GAME_SIZE
  game.height = GAME_SIZE
}
function initData() {
  line_arr = Array(line_num)
  all = {}
  dots = {}
  for (var i = 0; i < line_num; i++) {
    line_arr[i] = []
    dots[level_dots[i][0]] = i
    dots[level_dots[i][1]] = i
    drawDot(level_dots[i][0], color_arr[i])
    drawDot(level_dots[i][1], color_arr[i])
  }
}
// 画棋盘
function drawBack() {
  ctx_board.beginPath()
  ctx_board.strokeStyle = levelData[level]['full'] ? '#D0E9FF' : '#666'
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
function drawDot(id, c) {
  var [x, y] = id2xy(id)
  ctx_board.beginPath()
  ctx_board.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`
  ctx_board.arc(
    x * (SIZE + 1) + SIZE / 2,
    y * (SIZE + 1) + SIZE / 2,
    SIZE / 4, 0, 2*Math.PI)
  ctx_board.fill()
}
// 画指尖
function drawFinger() {
  if (!fingerX || !fingerY) {
    return false
  }
  ctx.beginPath()
  var c = color_arr[current_line]
  ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.3)`
  ctx.arc(fingerX, fingerY, SIZE*.75, 0, 2*Math.PI)
  ctx.fill()
}
// 画虚格
function drawBlock(id) {
  var [x, y] = id2xy(id)
  var c = color_arr[all[id]]
  ctx_game.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.5)`
  ctx_game.fillRect(x * (SIZE + 1), y * (SIZE + 1), SIZE, SIZE)
  ctx_game.lineTo(x * (SIZE + 1) + SIZE/2, y * (SIZE + 1) + SIZE/2)
}
// 计算返回行列
function calcXY(e) {
  var x = e.touches[0].pageX, y = e.touches[0].pageY
  if (x < paddingLeft || x >= paddingLeft + GAME_SIZE - 1 ||
    y < paddingTop || y > paddingTop + GAME_SIZE) {
    can_play = false
    return 'no'
  }
  return [~~((x - paddingLeft) / (SIZE + 1)), ~~((y - paddingTop) / (SIZE + 1))]
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
    fingerX = undefined
    fingerY = undefined
    can_play = true
    current_id = undefined
    current_line = undefined
    if (levelData[level]['full']) {
      for (var i = 0; i < col_num; i++) {
        for (var j = 0; j < col_num; j++) {
          if (all[xy2id(i, j)] === undefined) {
            return false
          }
        }
      }
    } else {
      for (var id in dots) {
        if (all[id] === undefined) {
          return false
        }
      }
    }
    level ++
    if (level >= levelData.length) {
      alert('通关了！')
    } else {
      alert('通过')
      init()
    }
  })
}
// 触摸事件处理
function handleTouchStart(e) {
  var [x, y] = calcXY(e)
  var id = xy2id(x, y)
  if (dots[id] !== undefined) {
    current_line = dots[id]
    deleteLine(dots[id])
    startLine(id)
  } else if (all[id] !== undefined) {
    current_line = all[id]
    deleteSlice(id)
    startLine(id)
  } else {
    can_play = false
  }
}
function startLine(id) {
  current_id = id
  saveID(id)
}
function saveID(id) {
  all[id] = current_line
  line_arr[current_line].push(id)
}
function handleTouch(e) {
  e.preventDefault()
  var [x, y] = calcXY(e)
  var id = xy2id(x, y)
  if (can_play) {
    fingerX = e.touches[0].pageX
    fingerY = e.touches[0].pageY
    if (id !== current_id) {
      var [x_, y_] = id2xy(current_id)
      // 斜角情况
      if (Math.abs(x-x_) > 1 || Math.abs(y-y_) > 1) {
        return false
      }
      if (Math.abs(x-x_) == 1 && Math.abs(y-y_) == 1 && (dots[id] === undefined || dots[id] === current_line)) {
        var id0 = xy2id(x,y_), id1 = xy2id(x_,y)
        if (all[id0] === undefined && dots[id0] === undefined) {
          saveID(id0)
        } else if (all[id1] === undefined && dots[id1] === undefined) {
          saveID(id1)
        } else {
          return false
        }
      }
      if (all[id] === current_line) { // 自家线路
        deleteSlice(id)
      } else if (dots[id] === current_line) { // 自家终点
        can_play = false
        console.log('OK')
      } else if (dots[id] !== undefined) { // 别家端点
        return false
      } else if (all[id] !== undefined) { // 别家线路
        deleteLine(all[id])
      }
      startLine(id)
    }
  }
}
// 重启线路时删除后续线路
function deleteSlice(id) {
  var idx = line_arr[all[id]].indexOf(id)
  current_line = all[id]
  delete_arr = line_arr[all[id]].splice(idx, line_arr[all[id]].length)
  delete_arr.forEach(id => {
    delete all[id]
  })
}
function deleteLine(line) {
  line_arr[line].forEach(id => {
    delete all[id]
  })
  line_arr[line] = []
}
// 画所有格子
function drawGame() {
  ctx_game.clearRect(0, 0, GAME_SIZE, GAME_SIZE)
  for (var i = 0; i < line_num; i++)  {
    ctx_game.beginPath()
    var [x, y] = id2xy(line_arr[i][0])
    var c = color_arr[i]
    ctx_game.lineWidth = 6
    ctx_game.strokeStyle = `rgb(${c[0]},${c[1]},${c[2]})`
    ctx_game.moveTo(x * (SIZE + 1) + SIZE/2, y * (SIZE + 1) + SIZE/2)
    line_arr[i].forEach(block => {
      drawBlock(block)
    })
    ctx_game.stroke()
  }
}
// 渲染画布
function render() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.drawImage(board, paddingLeft, paddingTop)
  drawGame()
  ctx.drawImage(game, paddingLeft, paddingTop)
  drawFinger()
  window.requestAnimationFrame(render)
}
init()
bindEvent()
render()
alert('亮色网格线需填满通关')