import { addOrUpdatePassword,delPassword,getPasswordById } from "../../api";
import { LIST_ICONS } from "../../constant";
import { checkParam, getMasterPassword, showMyModal } from "../../utils";

// pages/password-add/password-add.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    platform: '',
    account: '',
    password: '',
    custom:'',
    isEditMode: false,

    _realAccount:'',
    _realPsd:'',
    _realCustom:'',

    LIST_ICONS:LIST_ICONS,
    showIconList:false // 控制是否显示LIST_ICONS
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.setData({
        isEditMode: true,
        id:options.id,
      });
      this.fetchPasswordDetails(options.id);
    }
  },

  fetchPasswordDetails(id) {
    getPasswordById(id).then((response) => {
      if (response.success) {
        const { platform, account, password,_realAccount,_realPsd,_realCustom,custom } = response.data;
        this.setData({
          _realAccount,_realPsd,_realCustom,
          platform,
          account,
          password,
          custom
        });
      } else {
        console.error('Failed to fetch password details:', response.message);
      }
    }).catch((error) => {
      console.error('Error fetching password details:', error);
    });
  },

  async delPsd(){
    const rst = await showMyModal("删除密码，是否继续？");
    if(!rst) return;

    await delPassword(this.data.id)

    wx.showToast({
      title: '操作成功',
      icon:'none'
    })
    wx.navigateBack()
  },

  
  onClickPlatform(e){
    console.log(e,123)
    this.setData({showIconList:true})
  },
  onSelectPlatform(e){
    console.log(e.target.dataset.platform)
    this.setData({
      showIconList:false,
      platform:e.target.dataset.platform+'账号'
    })
  },
  savePassword() {
    const { platform,_realAccount,_realPsd,_realCustom, isEditMode } = this.data;
    console.log("保存密码：",platform,_realAccount,_realPsd)

    // 参数校验
    if (!checkParam('platform',platform)) {
      wx.showToast({
        title: '平台名称不能为空，长度30字以内',
        icon: 'none',
      });
      return;
    }
    if(!_realAccount && !_realPsd && !_realCustom){
      return wx.showToast({
        title: '账号、密码、描述至少需填写一个',
        icon: 'none',
      })
    }
    if(_realAccount && _realAccount.length>50){
      return wx.showToast({
        title: '账号长度限制50字符以内',
        icon: 'none',
      })
    }
    if(_realPsd && _realPsd.length>50){
      return wx.showToast({
        title: '密码长度限制50字符以内',
        icon: 'none',
      })
    }
    if(_realCustom && _realCustom.length>200){
      return wx.showToast({
        title: '描述长度限制200字符以内',
        icon: 'none',
      })
    }




    // 验证主密码
    if(!getMasterPassword()){
      wx.showToast({
        icon: 'none',
        title: '主密码已过期，请重新验证',
      })
      wx.navigateBack();
      return;
    }

    const payload = {
      _id: this.data.id,
      platform:platform.trim(),
      account:_realAccount,
      password:_realPsd,
      custom:_realCustom
    };

    addOrUpdatePassword(payload, isEditMode).then((response) => {
      if (response.success) {
        wx.showToast({
          icon: 'none',
          title: '保存成功',
        })
        wx.navigateBack();
      } else {
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none',
        });
      }
    }).catch((error) => {
      console.error('Error saving password:', error);
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none',
      });
    });
  }
})
