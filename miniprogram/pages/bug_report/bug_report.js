import {addBugReport} from '../../api.js';

Page({
  data: {
    content: '',
    isSubmitting: false
  },

  onInput(e) {
    this.setData({
      content: e.detail.value
    })
  },

  async submitBug() {
    const { content, isSubmitting } = this.data
    if (isSubmitting) return
    
    // 输入校验
    if (!content.trim()) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
      return
    }
    
    this.setData({ isSubmitting: true })
    
    const rst = await addBugReport(content.trim())
    this.setData({ isSubmitting: false })
    
    if(rst){
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      })
      wx.switchTab({
        url: '/pages/home/home',
      })
    }

  }
})