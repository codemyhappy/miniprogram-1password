import { showMyModal } from "../../utils"

// pages/project-intro/project-intro.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onCopyHomePage(){
    wx.setClipboardData({
      data: 'https://www.xiaohongshu.com/user/profile/610e50bd00000000010088fd',
    })
    showMyModal('主页链接已复制至您的剪切板，可粘贴至小红书/任意浏览器查看',"复制提示",false)
  },
  onCopyGitUrl(){
    wx.setClipboardData({
      data: 'https://github.com/codemyhappy/miniprogram-1password',
    })
    showMyModal('项目链接已复制至您的剪切板，可粘贴至任意浏览器查看',"复制提示",false)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})