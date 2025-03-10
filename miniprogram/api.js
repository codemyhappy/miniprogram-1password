import { SHARED_APP_ID, SHARED_APP_RESOURCE_ENV_ID } from "./env";
import { encryptString, getMasterPassword, psdItemParser } from "./utils";

// 声明新的 cloud 实例，云开发共享环境
var sharedCloud = new wx.cloud.Cloud({
  // 资源方 AppID
  resourceAppid: SHARED_APP_ID,
  // 资源方环境 ID
  resourceEnv: SHARED_APP_RESOURCE_ENV_ID,
})

let inited = false;
/**
 * 获取cloudapi 防止反复调用
 * @param {{name:string,data:{action:string,data:object}}} param 
 */
export async function callFunction(param){
  if(inited) return sharedCloud.callFunction(param);
  await sharedCloud.init()
  inited = 1;
  return sharedCloud.callFunction(param);
}

/**
 * 模拟接口 - 判断用户是否设置过密码
 * @returns {Promise<Object>} 返回值示例: { hasPassword: true }
 */
export async function checkHasPassword() {
  console.log('[API] checkHasPassword - 开始调用');

  const {result} = await callFunction({
    name:'psdUserManage',
    data:{
      action:"getMineInfo",
      data:{}
    }
  })
  console.log('[API] 我的个人信息',result);
  if(result && result.data && result.data.userinfo){
    return { hasPassword: !!result.data.userinfo.psd }
  }

  return { hasPassword: false }
  
}

/**
 * 模拟接口 - 保存用户密码
 * @param {string} encryptedPassword 加密后的密码
 * @returns {Promise<Object>} 返回值示例: { success: true }
 */
export async function savePassword(encryptedPassword) {
  console.log('[API] savePassword - 开始调用');

  const {result} = await callFunction({
    name:'psdUserManage',
    data:{
      action:"add",
      data:{
        psd: encryptedPassword
      }
    }
  })
  console.log('[API] savePassword',result);
  if(result && result.data){
    return { success: !!result.data._id }
  }

  return { success: false }
}

/**
 * 模拟接口 - 验证用户密码
 * @param {string} encryptedPassword 加密后的密码
 * @returns {Promise<Object>} 返回值示例: { isValid: true }
 */
export async function verifyPassword(encryptedPassword) {
  console.log('[API] verifyPassword - 开始调用, 参数:', { encryptedPassword });

  const {result} = await callFunction({
    name:'psdUserManage',
    data:{
      action:'verifyPassword',
      data:{encryptedPassword}
    }
  })
  console.log('[API] verifyPassword',result);
  if(result && result.data){
    return { isValid: !!result.data.isValid }
  }

  return { isValid: false }

}

/**
 * 模拟接口 - 根据密码 ID 获取详细信息
 * @param {string} id 密码 ID
 * @returns {Promise<Object>} 返回值示例: { success: true, data: { platform: '平台名', account: '账号', password: '密码' } }
 */
export async function getPasswordById(id) {
  console.log('[API] getPasswordById - 开始调用, 参数:', { id });

  const {result} = await callFunction({
    name:'psdRecordsManage',
    data:{
      action:'getOne',
      data:{
        _id:id
      }
    }
  })
  console.log(result.data,333)
  return {
    success:true,
    data:psdItemParser(result.data)
  }
}

/**
 * 模拟接口 - 新增或更新密码
 * @param {PsdRecords} payload 包含平台名称、账号和密码的对象，此处是明文对象
 * @param {boolean} isEditMode 是否为编辑模式
 * @returns {Promise<{ success: boolean,id:string,msg?:string }>} 返回值示例: { success: true }
 */
export async function addOrUpdatePassword(payload, isEditMode) {
  console.log('[API] addOrUpdatePassword - 开始调用, 参数:', { payload, isEditMode });

  const {_id,account,password,platform,custom} = payload

  if(isEditMode){
    if(!_id) return {success:false,msg:'数据错误，_id不存在'}

    const submitData = {
      _id,
      platform,
      custom:encryptString(custom,getMasterPassword()),
      account:encryptString(account,getMasterPassword()),
      password:encryptString(password,getMasterPassword()),
    };

    const {result} = await callFunction({
      name:'psdRecordsManage',
      data:{
        action:'updateById',
        data:submitData
      }
    })
    return {success:true,id:result.data._id}
  }

  const submitData = {
    platform,
    custom:encryptString(custom,getMasterPassword()),
    account:encryptString(account,getMasterPassword()),
    password:encryptString(password,getMasterPassword()),
  };

  const {result} = await callFunction({
    name:'psdRecordsManage',
    data:{
      action:'add',
      data:submitData
    }
  })
  return {success:true,id:result.data._id}

}

/**
 * 模拟接口 - 获取密码列表
 * @returns {Promise<Array<PsdRecords>>} 返回值示例: [{ platform: '平台名', account: '账号', password: '密码' }]
 */
export async function getPasswords() {
  console.log('[API] getPasswords - 开始调用');

  const {result} = await callFunction({
    name:'psdRecordsManage',
    data:{
      action:'getBySelf',
      data:{
        filter:{},
        pageDto:{page:1,size:30}
      }
    }
  })
  console.log('[API] getPasswords',result,123)
  return result.data.dataList.map(item=>{
    item.icon = item.platform.slice(0,4);
    return psdItemParser(item);
  })
}

/**
 * 删除单条密码
 * @param {string} id 记录的id
 */
export async function delPassword(id){
  return  callFunction({
    name:'psdRecordsManage',
    data:{
      action:'deleteOne',
      data:{
        _id:id
      }
    }
  })
}

/**
 * 问题&bug上报接口
 * @param {string} content 上报的内容
 */
export async function addBugReport(content){
  try {
    await callFunction({
      name: 'bugManage',
      data: {
        action: 'add',
        data:{
          content: content.trim()
        }
      }
    })
    return true    
  } catch (error) {
    return false
  } 
}