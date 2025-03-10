
/**
 * 返回错误
 * @param {string} msg 错误消息
 */
module.exports.newError = function(msg){
  return {
    code: 0,
    msg
  }
}

/**
 * 返回数据
 * @param {object} data 数据结构
 */
module.exports.newResponse = function(data){
  return {
    code: 200,
    data
  }
}