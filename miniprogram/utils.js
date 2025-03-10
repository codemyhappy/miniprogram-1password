import CryptoJS from 'crypto-js';
import { STORAGE_KEY_FOR_SESSION } from './constant';
import { WX_TEMPLATE_ID_UPDATE_APP_VERSION } from './env';


/**
 * 工具方法 - 显示弹窗
 * @param {string} title 标题
 * @param {string} content 内容
 * @param {boolean} showCancel 是否显示取消按钮
 * @returns {Promise<Boolean>}
 */
export async function showMyModal(content, title="提示", showCancel = true) {
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          resolve(true)
        } else if (res.cancel) {
          console.log('用户点击取消')
          resolve(false)
        }
      }
    })
  })
  
}

/**
 * 功能开发中
 */
export function deving(){
  requestSubscribeMessage()
  wx.showToast({
    title: '功能开发中，敬请期待',
    icon:'none'
  })
}

/**
 * 获取订阅消息
 */
export function requestSubscribeMessage(){
  // 订阅消息：版本更新通知
  wx.requestSubscribeMessage({
    tmplIds: [WX_TEMPLATE_ID_UPDATE_APP_VERSION],
    success(res) {
        console.log('订阅普通消息成功', res);
    },
    fail(err) {
        console.error('订阅普通消息失败', err);
    }
  });
}


/**
 * 加密字符串 - 使用AES
 * @param {string} str 要加密的字符串
 * @param {string} password 用户的密码
 * @returns {string} 加密后的字符串
 */
export function encryptString(str, password) {
  str = str || ""
  if(!str) return '';

  const AES_KEY = CryptoJS.enc.Utf8.parse(password.padEnd(32, '0').substring(0, 32)); // 16字节密钥
  const AES_IV = CryptoJS.enc.Utf8.parse(password.padEnd(16, '0').substring(0, 16));  // 16字节IV
  const encrypted = CryptoJS.AES.encrypt(str, AES_KEY, {
    iv: AES_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

/**
 * 解密字符串 - 使用AES
 * @param {string} str 要解密的字符串
 * @param {string} password 用户的密码
 * @returns {string} 解密后的字符串
 */
export function decryptString(str, password) {
  str = str || ""
  if(!str) return '';

  const AES_KEY = CryptoJS.enc.Utf8.parse(password.padEnd(32, '0').substring(0, 32)); // 16字节密钥
  const AES_IV = CryptoJS.enc.Utf8.parse(password.padEnd(16, '0').substring(0, 16));  // 16字节IV
  const decrypted = CryptoJS.AES.decrypt(str, AES_KEY, {
    iv: AES_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  console.log(str,password)
  const rst = decrypted.toString(CryptoJS.enc.Utf8);
  console.log(str,password,rst)
  return rst;
}

/**
 * 检查登录，本地有主密码，则说明已登录
 */
export function checkHasLogin(){
  return !!(getMasterPassword())
}

/**
 * 从本地获取主密码，未过期的明文密码
 * 先从内存中取`getApp().globalData.masterPassword`
 * 再从缓存中取`wx.getStorageSync(STORAGE_KEY_FOR_SESSION)`
 * @returns {{masterPassword:string,expire:number}}
 */
export function getMasterPassword(){
  let masterPassword = getApp().globalData.masterPassword;
  if(masterPassword) return masterPassword;

  const rst = wx.getStorageSync(STORAGE_KEY_FOR_SESSION)
  if(!rst || !rst.masterPassword || !rst.expire) return '';
  try{
    // 密码过期
    if(Date.now()>rst.expire) return '';
    return rst.masterPassword
  }catch(e){
    return ''
  }
}

/**
 * 登录成功后的处理
 * 1. 将主密码保存至内存
 * 2. 将主密码保存至缓存，或者清空缓存
 * @param {*} masterPassword 
 * @param {*} expire 
 */
export function setLoginedSession(masterPassword,expire){
  getApp().globalData.masterPassword = masterPassword;
  wx.setStorageSync(STORAGE_KEY_FOR_SESSION,{masterPassword,expire:expire||0})
}


/**
 * 转换数据库中的密文至本地内存中的明文
 * @param {PsdRecords} psdItem
 */
export function psdItemParser(psdItem){
  return {
    ...psdItem,
    _realCustom:decryptString(psdItem.custom,getMasterPassword()),
    _realAccount: decryptString(psdItem.account,getMasterPassword()),
    _realPsd: decryptString(psdItem.password,getMasterPassword()),
  }

}

/**
 * 校验参数
 * @param {'platform'|'password'} type 
 * @param {string} value 
 */
export function checkParam(type,value){
  value = `${value}`;
  if(type==='password') 
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/.test(value);
  if(type==='platform') 
    return value.length <= 30 && value.trim() === value && value.trim().length>0
}