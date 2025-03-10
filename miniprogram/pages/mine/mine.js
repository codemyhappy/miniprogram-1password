import { APP_VERSION } from "../../env"
import { deving, showMyModal } from "../../utils"

// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    player:{},
    appVersion:APP_VERSION,
    secretOpenid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    
  },
  onClickIntro(){
    wx.navigateTo({
      url: '/pages/project-intro/project-intro',
    })
  },
  onClickBug(){
    wx.navigateTo({
      url: '/pages/bug_report/bug_report',
    })
  },
  onClickClearCache(){
    wx.clearStorageSync()
    getApp().globalData.masterPassword='';
    wx.showToast({
      title: '已清空本地缓存，敏感操作前需重新认证主密码',
      icon:'none'
    })
  },

  deving: deving

})

function replaceMiddleWithStar(str) {
  if (str.length <= 8) {
      return str;
  }
  const start = str.slice(0, 4);
  const end = str.slice(-4);
  const middle = '*'.repeat(str.length - 8);
  return start + middle + end;
}