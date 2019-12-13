// 节流throttle代码（定时器）：
export const throttle = function(fn, delay = 50) {
  var canRun = true; // 通过闭包保存一个标记
  return function () {
    console.log(canRun)
    if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
    canRun = false; // 立即设置为false

    setTimeout(() => { // 将外部传入的函数的执行放在setTimeout中
      fn.apply(this, arguments);
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
      canRun = true;0
    }, delay);
  };
}
