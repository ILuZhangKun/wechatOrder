// 本服务用于封装请求
// 返回的是一个promisepromise
var server = "http://60.205.229.120/wechatorder/index.php/Apiwx";
var sendRrquest = function (url, method, data, header) {
  console.log(server + url);
  console.log(header);
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: server + url,
      data: data,
      method: method,
      header: header,
      success: resolve,
      fail: reject
    })
  });
  return promise;
};

module.exports.sendRrquest = sendRrquest;