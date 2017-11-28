var input = document.getElementsByTagName('input')[0]
var span = document.getElementsByTagName('span')[0]
var div = document.getElementsByTagName('div')[0]
var ctx1 = document.getElementsByTagName('canvas')[0].getContext('2d')
var ctx2 = document.getElementsByTagName('canvas')[1].getContext('2d')
var ctx3 = document.getElementsByTagName('canvas')[2].getContext('2d')

var points = [], colors = [], running = true, steps = 200, interval = 16, num

ctx1.font = '16px consolas'
ctx1.fillStyle = ctx1.strokeStyle = 'hsl(0, 0%, 50%)'
ctx1.lineWidth = ctx2.lineWidth = 2
ctx3.strokeStyle = 'hsl(0, 90%, 70%)'

function count() {
  num = parseInt(input.value)
  span.innerHTML = num
}

function toggle() {
  input.disabled = running = !running
}

function draw(per, arr, color) {
  var ary = []
  var node

  ctx2.strokeStyle = ctx2.fillStyle = colors[color]

  node = arr.reduce(function(previous, current, index) {
    // 从第二个元素开始，第二个点，这时候index为1，计算得到p点，index为1的时候，p点为bezier开始点到第一个控制点的插值
    // 第三个元素的时候，第三个点，index为2，计算得到p点，index为2的时候，p点为第一个控制点向第二个控制点移动的插值
    var p = {x: arr[index - 1].x + (arr[index].x - arr[index - 1].x) * per, y: arr[index - 1].y + (arr[index].y - arr[index - 1].y) * per}

    if(index > 1) {
      // 当达到第二个控制点的时候，获取从开始点到第一个控制点的p，进行line
      ctx2.beginPath()
      ctx2.moveTo(previous.x, previous.y)
      ctx2.lineTo(p.x, p.y)
      ctx2.stroke()
      ctx2.closePath()
    }
    // 绘制当前的插值点
    ctx2.beginPath()
    ctx2.arc(p.x, p.y, 3, 0, Math.PI * 2, true)
    ctx2.fill()
    ctx2.closePath()
    // 将坐标点push到新的坐标数组中
    ary.push(p)
    return p
  })

  if(ary.length > 1) {
    // 将插值作为新的开始点和控制点进行绘制，就这样递归下去
    draw(per, ary, color + 1)
  } else {
    // 如果插值的数组只有1个值，绘制的就是bezier曲线上的点，从起点一点一点连到结束点
    ctx3.lineTo(node.x, node.y)
    ctx3.stroke()
  }
}

var drawAsync = eval(Wind.compile("async", function () {
  toggle()
  ctx3.beginPath()
  ctx3.moveTo(points[0].x, points[0].y)
  for(var i = 0; i <= steps; i++) {
    draw(i / steps, points, 0)
    $await(Wind.Async.sleep(interval))
    ctx2.clearRect(0, 0, 800, 600)
  }
  ctx3.closePath()
  points = []
  toggle()
}))

div.addEventListener('click', function(e) {
  if(running) {
    return
  }

  var point = {x: e.pageX - div.offsetLeft, y: e.pageY - div.offsetTop}

  if(points.length == 0) {
    ctx1.clearRect(0, 0, 800, 600)
    ctx2.clearRect(0, 0, 800, 600)
    ctx3.clearRect(0, 0, 800, 600)
  } else {
    ctx1.beginPath()
    ctx1.moveTo(point.x, point.y)
    ctx1.lineTo(points[points.length - 1].x, points[points.length - 1].y)
    ctx1.stroke()
    ctx1.closePath()
  }

  ctx1.beginPath()
  ctx1.fillText('[' + point.x + ', ' + point.y + ']', 15, 25 * (points.length + 1))
  ctx1.arc(point.x, point.y, 4, 0, Math.PI * 2, true)
  ctx1.fill()
  ctx1.closePath()

  points.push(point)

  if(points.length == num) {
    drawAsync().start()
  }
}, false)

input.addEventListener('change', count, false)

window.addEventListener('load', function() {
  for(var i = 0; i < parseInt(input.max); i++) {
    colors[i] = 'hsl(' + 60*(i + 1) + ', 60%, 60%)'
  }
  count()
  toggle()
}, false)