$.fn.extend({
  animateCss: function (animationName, callback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function () {
      $(this).removeClass('animated ' + animationName);
      if (callback) {
        callback();
      }
    });
    return this;
  }
});

const RADIUS = 450,
  PI = Math.PI,
  SIN_30 = Math.sin(PI / 6),
  COS_30 = Math.cos(PI / 6)
let controlCenter = $("#control_center_wrap"),
  controlCenterOut = $("#control_center_out"),
  controlItems = $(".control_item_wrap"),
  route = $("#route_wrap"),
  side = $("#side_wrap"),
  sideWindow = $("#sideWindow"),
  population = $("#population_wrap"),
  city = $("#city_wrap"),
  GDPMessage = $("#GDPMessage_wrap"),
  map_shiliang = $("#map_shiliang"),
  map_yingxiang = $("#map_yingxiang"),
  itemIsShow = false

controlCenter.on('click', function () {
  itemIsShow = !itemIsShow
  if (itemIsShow) {
    itemControl(0, 1)
    controlCenterOut.removeClass('hasAnimate')
  } else {
    itemControl(1, 0)
    controlCenterOut.addClass('hasAnimate')
  }
})

// 点击圆盘事件
controlItems.on('click', function (e) {
  controlItems.removeClass('select')
  $(this).addClass('select')
})

// 控制屏幕下方圆盘上四个态势选项的函数
// 0,1表示出现   1,0表示隐藏
function itemControl(start, end, callback) {
  $({
    value: start
  }).animate({
    value: end
  }, {
    step: function (now) {
      controlItems.css('transform', `scale(${now * 0.75})`)
      route.css('left', `-${RADIUS * COS_30 * now}px`)
      route.css('top', `-${RADIUS * SIN_30 * now}px`)
      population.css('left', `-${RADIUS * SIN_30 * now}px`)
      population.css('top', `-${RADIUS * COS_30 * now}px`)
      city.css('right', `-${RADIUS * SIN_30 * now}px`)
      city.css('top', `-${RADIUS * COS_30 * now}px`)
      GDPMessage.css('right', `-${RADIUS * COS_30 * now}px`)
      GDPMessage.css('top', `-${RADIUS * SIN_30 * now}px`)
    },
    duration: 1500,
    done: function () {
      if (callback) callback()
    }
  })
}

function showSide() {
  $("#side_left").css('width', "0px")
  hideSideWindow();
  side.css('right', '0px')
  side.animateCss('fadeInRight')
}

function hideSide() {
  if (side.css('right') === '-594px') {
    return
  }
  side.css('right', '-594px')
  side.animateCss('fadeOutRight')
  $("#side_left").css('width', "44px")
}

function showSideWindow() {
  sideWindow.css('visibility', 'visible')
  // sideWindow.animateCss('fadeInLeft')
}

function hideSideWindow() {
  // sideWindow.animateCss('fadeOutLeft', function () {
  //   sideWindow.css('visibility', 'hidden')
  // })
  sideWindow.css('visibility', 'hidden')
}

// 隐藏第一页面的UI
function hideUI1() {
  // 首先将四周项目收起再将大圆收起
  if (!controlCenterOut.hasClass('hasAnimate')) {
    itemControl(1, 0, function () {
      controlCenter.animateCss('fadeOutDown', function () {
        controlCenter.css('visibility', 'hidden')
      })
      $("#control_rigth_wrap").animateCss('fadeOutRight', function () {
        $("#control_rigth_wrap").css('visibility', 'hidden')
      })
    })
    controlCenterOut.addClass('hasAnimate')
  } else {
    controlCenter.animateCss('fadeOutDown', function () {
      controlCenter.css('visibility', 'hidden')
    })
    $("#control_rigth_wrap").animateCss('fadeOutRight', function () {
      $("#control_rigth_wrap").css('visibility', 'hidden')
    })
  }
}

// 显示第一页面的UI
function showUI1() {
  controlCenter.css('visibility', 'visible')
  controlCenter.animateCss('fadeInUp')
  $("#control_rigth_wrap").css('visibility', 'visible')
  $("#control_rigth_wrap").animateCss('fadeInRight')
}

function showUI2() {
  side.animateCss('fadeInRight')
  side.css('visibility', 'visible')
}

function hideUI2() {
  side.animateCss('fadeOutRight', function () {
    side.css('visibility', 'hidden')
  })
}

// 切换到矢量图
map_shiliang.on('click', function () {
  if (!map_shiliang.hasClass('select')) {
    map_yingxiang.removeClass('select')
    map_shiliang.addClass('select')
    // 地图控制
  }
})
// 切换到影像图
map_yingxiang.on('click', function () {
  if (!map_yingxiang.hasClass('select')) {
    map_shiliang.removeClass('select')
    map_yingxiang.addClass('select')
    // 地图控制
  }
})

// 绘制雷达图
radarChart.initChart({
  data1: [20, 10, 9, 16, 18],
  data2: [13, 7, 21, 15, 19]
})
// 绘制折现柱状图
lineChart.initChart({
  dataLine: [30, 21, 25, 18, 16, 2, 26, 35],
  dataBar: [12, 16, 31, 15, 12, 37, 17, 15]
})


$("#side_left").on('click', function () {
  showSide()
})