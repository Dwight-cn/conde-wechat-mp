// 节流throttle代码（定时器）：

export function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 16.7;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.apply(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}
