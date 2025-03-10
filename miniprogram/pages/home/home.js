// pages/home/home.js
import { checkHasPassword, savePassword, verifyPassword,getPasswords } from '../../api';
import { checkHasLogin, checkParam, decryptString, encryptString, setLoginedSession, showMyModal,getMasterPassword } from '../../utils';

Page({
  data: {
    /** 是否登录 */
    hasLogin:false,
    hasPassword: false, // 是否已设置密码
    showLoginModal: false, // 是否显示登录弹窗
    /** 是否勾选checkbox框 */
    hasCheckedSave: true,
    /** 是否真正初始化 */
    isIniting:true,

    /** 是否显示提示界面 */
    showTipPage: true, // 是否显示登录弹窗
    masterPassword: '', // 用户输入的密码
    searchQuery: '', // 搜索关键词
    passwords: [], // 密码列表
    filteredPasswords: [], // 过滤后的密码列表

    /** 登录之后的操作方法 */
    afterLoginAction:'',
    /** 登录之后的操作方法的参数列表 */
    afterLoginArgs:[]
  },

  /**
   * 页面加载时触发
   * 检查是否已设置主密码，并根据结果更新页面状态
   */
  onLoad: async function () {
  },
  onShow: function () {
    this.setup();
  },

  /**
   * 初始化函数
   */
  async setup(){
    console.log('页面加载开始');
    this.setData({ isIniting:true });
    const hasLogin = checkHasLogin()
    this.setData({ hasLogin });
    console.log(`检查结果：已登录=${hasLogin}`);

    console.log('正在检查是否已设置密码...');
    const { hasPassword } = await checkHasPassword();
    console.log(`检查结果：已设置密码=${hasPassword}`);
    this.setData({ hasPassword });

    if (hasPassword) {
      console.log('正在获取密码列表...');
      try {
        const passwords = await getPasswords();
        console.log('获取密码列表成功:', passwords);
        this.setData({
          passwords,
          filteredPasswords: passwords // 初始化过滤后的密码列表
        });
      } catch (error) {
        console.error('获取密码列表失败:', error);
      }
    }
    this.setData({ isIniting:false });
  },

  /**
   * 监听搜索框输入事件
   * 更新搜索关键词并过滤密码列表
   * @param {Object} e - 事件对象
   */
  onSearchInput: function (e) {
    console.log('用户输入搜索关键词:', e.detail.value);
    this.setData({ searchQuery: e.detail.value });
    this.filterPasswords();
  },

  /**
   * 复制
   */
  onCopy(e){
    console.log(e.target.dataset)

    const {item} = e.target.dataset
    // 未登录时
    if(this.data.hasPassword && !this.data.hasLogin) {
      return this.setData({
        afterLoginAction:'onCopy',
        afterLoginArgs:arguments,
        showTipPage:false,
        showLoginModal:true
      })
    }

    const realAccount = decryptString(item.account,getMasterPassword());
    const realPsd = decryptString(item.password,getMasterPassword());
    const realCustom = decryptString(item.custom,getMasterPassword());

    wx.setClipboardData({
      data: `平台：${item.platform} 账号名/ID：${realAccount||'无'} 密码：${realPsd||'无'} 描述：${realCustom||'无'}`,
      success (res) {
        wx.getClipboardData({
          success (res) {
            // console.log(res.data) // data
          }
        })
      }
    })
  },

  /**
   * 根据搜索关键词过滤密码列表
   */
  filterPasswords: function () {
    console.log('开始过滤密码列表...');
    const query = this.data.searchQuery.toLowerCase();
    console.log(`当前搜索关键词：${query}`);
    const filtered = this.data.passwords.filter(password =>
      password.platform.toLowerCase().includes(query) ||
      password.account.toLowerCase().includes(query)
    );
    console.log(`过滤结果：${filtered.length} 条匹配记录`);
    this.setData({ filteredPasswords: filtered });
    console.log('密码列表过滤完成');
  },

  showTips(){
    this.setData({
      showTipPage:!this.data.showTipPage,
      showLoginModal:false
    })
  },
  toggleLoginModal(e){
    // 仅点击蒙层此事件生效
    if(e.target.dataset.modalId!==e.currentTarget.dataset.modalId) return;
    this.setData({
      showLoginModal:!this.data.showLoginModal
    })
  },
  /**
   * 跳转到添加密码页面
   */
  navigateToAddPassword (e) {
    if(this.data.isIniting) return wx.showToast({
      title: '页面正在初始，请稍后再试',
      icon:'none'
    })
    
    // 未设置主密码时
    if(!this.data.hasPassword) return this.setData({
      showTipPage:false,
      showLoginModal:true
    })

    // 未登录时
    if(this.data.hasPassword && !this.data.hasLogin) {
      return this.setData({
        afterLoginAction:'navigateToAddPassword',
        afterLoginArgs:arguments,
        showTipPage:false,
        showLoginModal:true
      })
    }


    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/password-add/password-add'+(id?("?id="+id):'')
    });
  },


  /**
   * 处理登录逻辑
   */
  async handleLogin() {
    console.log('开始处理登录...');
    const { masterPassword } = this.data;
    if (!masterPassword) {
      console.warn('未输入密码，提示用户输入');
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    try {
      console.log('正在加密密码...');
      const encryptedPassword = encryptString(masterPassword, masterPassword);
      console.log('正在验证密码...');
      const { isValid } = await verifyPassword(encryptedPassword);

      if (isValid) {
        console.log('密码验证通过，关闭登录弹窗');
        this.setData({ showLoginModal: false });
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
        // 设置到缓存
        setLoginedSession(masterPassword,this.data.hasCheckedSave?(Date.now()+5*24*60*60*1000):0)
        // 更新界面
        this.setData({hasLogin:true})

        // 登录成功后，重新初始化
        if(this.data.afterLoginAction && typeof this[this.data.afterLoginAction]==='function'){
          (this[this.data.afterLoginAction]).apply(this,this.data.afterLoginArgs)
          this.setData({afterLoginAction:'',afterLoginArgs:[]})
        }else{
          this.setup();
        }
      } else {
        console.warn('密码错误');
        wx.showToast({
          title: '密码错误',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('验证密码失败:', error);
      wx.showToast({
        title: '验证密码失败',
        icon: 'none'
      });
    }
    console.log('登录处理完成');
  },


  /**
   * 处理设置密码逻辑
   */
  async handleSetPassword() {
    console.log('开始处理设置密码...');
    const { masterPassword } = this.data;
    if (!masterPassword) {
      console.warn('未输入密码，提示用户输入');
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }
    if(!checkParam('password',masterPassword)){
      wx.showToast({
        title: '密码格式不正确，要求8-20位，包含大小写和数字',
        icon: 'none'
      });
      return;
    }


    const rst = await showMyModal(`请确认是否将主密码设置为：${masterPassword}，一经设置将不允许更改，请慎重考虑`)
    if(!rst) return;
  
    try {
      console.log('正在加密密码...');
      const encryptedPassword = encryptString(masterPassword, masterPassword);
      console.log('正在保存密码...');
      await savePassword(encryptedPassword);
  
      console.log('密码设置成功');
      wx.showToast({
        title: '密码设置成功',
        icon: 'success'
      });
  
      // 更新状态以关闭弹窗并显示主界面
      this.setData({ hasPassword: true, showLoginModal: false });
    } catch (error) {
      console.error('设置密码失败:', error);
      wx.showToast({
        title: '设置密码失败',
        icon: 'none'
      });
    }
    console.log('设置密码处理完成');
  }
});
