const cloud = require('wx-server-sdk')
const { newResponse, newError } = require('./response')
cloud.init({ 
  env: cloud.DYNAMIC_CURRENT_ENV,
  timezone: 'Asia/Shanghai'
}) 
// 初始化数据库
const db = cloud.database()

/**
 * 初始化函数，返回一些通用的操作函数：新增/修改/查询
 * @param {*} param0 
 */
module.exports.handlerInit = function(collectionName,{event, context}=option){
  /** @type {DB.CollectionReference} */
  const collection = db.collection(collectionName)
  const wxContext = cloud.getWXContext()
  // 若存在来源的appid，则认为是共享环境
  const openid = wxContext.FROM_APPID?wxContext.FROM_OPENID:wxContext.OPENID;
  /**
   * 新增数据
   * @param {*} data 
   */
  async function add(data={}){
    const rst = await collection.add({
      data:{
        ...data,
        del_flag: false,
        create_by_openid: openid,
        create_time: Date.now()
      }
    })
    return newResponse({_id:rst._id})
  }

 
  /**
   * 根据id更新
   * @param {*} param0 
   */
  async function updateById(data){
    const _id = data._id;
    if(!_id) return newError('updateById 调用失败！参数_id不存在！')

    const updateWill = {
      ...data,
      update_time: Date.now()
    };
    delete updateWill._id;// 不能更新_id值
    const rst = await collection.doc(_id).update({
      data:updateWill,
    })
    return newResponse({rst:rst.stats.updated})
  }

  /**
   * 删除一条
   * @param {*} _id 
   */
  async function deleteOne(_id){
    if(!_id) return newError('deleteOne 调用失败！参数_id不存在！')
    return updateById({_id,del_flag:true})
  }

  /**
   * 获取数据列表
   * @param {*} filter 
   * @param {*} pageDto 
   */
  async function get(filter={},pageDto={page:1,size:10}){
    const rst = await collection.where({
      ...filter,
      del_flag:false
    }).skip(pageDto.size*(pageDto.page-1)).limit(pageDto.size).get();

    const totalRst = await collection.where({
      ...filter,
      del_flag:false
    }).count()

    return newResponse({
      dataList:rst.data,
      total:totalRst.total,
      pageDto
    })
  }

  /**
   * 获取自己的数据列表，根据字段`create_by_openid`
   * @param {*} filter 
   * @param {*} pageDto 
   */
  function getBySelf(filter={},pageDto={page:1,size:10}){
    filter = filter || {}
    filter.create_by_openid = openid
    return get(filter,pageDto)
  }

  /**
   * 根据id获取其中一条
   * @param {*} _id 
   */
  async function getOne(_id){
    if(!_id) return newError('getOne 调用失败！参数_id不存在！')

    const rst = await collection.doc(_id).get()
    return newResponse(rst.data)
  }
  
  function getWXContext(){
    const ctx = cloud.getWXContext()

    return newResponse({...ctx})
  }
  return {
    add,updateById,deleteOne,get,getOne,getWXContext,getBySelf
  }
}