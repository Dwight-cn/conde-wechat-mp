const formatTime = (date) => {
  if (!date) return ''
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//字符串转换为时间戳
const getDateTimeStamp = (dateStr) => {
  return Date.parse(dateStr.replace(/-/gi, "/"));
}

//.将返回的时间戳与当前时间戳进行比较，转换成几秒前、几分钟前、几小时前、几天前的形式。
const getDateDiff = (dateStr) => {
  if(!dateStr) return ''
  let publishTime = getDateTimeStamp(formatTime(dateStr)) / 1000,
    d_seconds,
    d_minutes,
    d_hours,
    d_days,
    timeNow = parseInt(new Date().getTime() / 1000),
    d,

    date = new Date(publishTime * 1000),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  //小于10的在前面补0
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }

  d = timeNow - publishTime;
  d_days = parseInt(d / 86400);
  d_hours = parseInt(d / 3600);
  d_minutes = parseInt(d / 60);
  d_seconds = parseInt(d);

  if (d_days > 0 && d_days < 2) {
    return d_days + '天前';
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前';
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前';
  } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚发表';
    } else {
      return d_seconds + '秒前';
    }
  } else if (d_days >= 3 && d_days < 30) {
    return M + '-' + D + ' ' + H + ':' + m;
  } else if (d_days >= 30) {
    return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
  }
}


const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const filterHTMLTag = (html) => {
  if (!html) return ''
  var html = html.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
  html = html.replace(/[|]*\n/, '') //去除行尾空格
  html = html.replace(/&npsp;/ig, ''); //去掉npsp
  return html;
}


module.exports = {
  formatTime,
  formatNumber,
  filterHTMLTag,
  getDateDiff
}
