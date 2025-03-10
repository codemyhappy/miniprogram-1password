// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.cloud.init({
      traceUser: true
    })
    let c1 = new wx.cloud.Cloud({
      // 资源方 AppID
      resourceAppid: 'wx2e6ae8f92039ec28',
      // 资源方环境 ID
      resourceEnv: 'room-prod-9g5bxct8466197bf',
    })

    await c1.init()

    c1.callFunction({
      name:'psdUserManage',
      data:{
        action: 'getWXContext',
        data:{}
      }
    }).then(res=>{
      showMyModal('成功后的结果'+JSON.stringify(res))
    }).catch(e=>{
      showMyModal('失败后的结果'+JSON.stringify(e))
    })
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