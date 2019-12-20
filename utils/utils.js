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

// 函数防抖
export function debounce(fn, delay) {
  let timeout = null; // 创建一个标记用来存放定时器的返回值
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout( function() { // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(context, args);
    }, delay);
  };
}
