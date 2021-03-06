import Vue from "vue";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

Vue.filter("timeAgo", (timestamp) => {
  var currentTime = new Date().getTime();
  var between = currentTime - timestamp;
  var days = Math.floor(between / (24 * 3600 * 1000));
  if (days === 0) {
    var leave1 = between % (24 * 3600 * 1000);
    var hours = Math.floor(leave1 / (3600 * 1000));
    if (hours === 0) {
      var leave2 = leave1 % (3600 * 1000);
      var minutes = Math.floor(leave2 / (60 * 1000));
      if (minutes === 0) {
        var leave3 = leave2 % (60 * 1000);
        var seconds = Math.round(leave3 / 1000);
        return seconds + " 秒前";
      }
      return minutes + " 分钟前";
    }
    return hours + " 小时前";
  }
  if (days < 0) return "刚刚";
  if (days < 5) {
    return days + " 天前";
  } else {
    return dayjs(timestamp).format("YYYY-MM-DD");
  }
});

Vue.filter("date", (timestamp) => {
  return dayjs(timestamp).format("YYYY-MM-DD");
});

Vue.filter("datetime", (timestamp) => {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm");
});

Vue.filter("month", (month) => {
  return Number(month) < 10 ? "0" + month : month;
});
