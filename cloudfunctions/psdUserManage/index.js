// 云函数入口文件

const { handlerInit } = require('./handler');
const { newError } = require('./response');


/**
 * 云函数入口函数，入参必须包含action和data两个字段
 * @param {{action:string,data:any}} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  // 获取封装好的操作方法
  const handler = handlerInit("psd_users",{event,context})
 
  /** @type {'add'|'updateById'|'deleteOne'|'get'|'getOne'} */
  const action = event.action;
  const data = event.data;
  if(!action) return newError('action 不能为空！')
  if(!data) return newError('data 不能为空！')

  // 根据操作类型调用对应的方法
  // if(action==='get')
  //   return handler.get(data.filter,data.pageDto||{page:1,size:10})
  if(action==='add') return handler.add(data)
  if(action==='updateById') return handler.updateById(data)
  if(action==='deleteOne') return handler.deleteOne(data._id)
  if(action==='getOne') return handler.getOne(data._id)
  if(action==='getWXContext') return handler.getWXContext()
  if(action==='getMineInfo') return handler.getMineInfo()
  if(action==='verifyPassword') return handler.verifyPassword(data.encryptedPassword)
  
  return newError('未找到合适的操作方法！'+action)
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}