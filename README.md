# 微信小程序密码管理工具

## 项目简介
本项目是一个基于微信小程序的密码管理工具，主要功能包括：
- 安全的密码存储与管理
- 基于微信的多平台账号密码备份
- 主密码保护机制
- 客户端加密存储
- 问题反馈与技术支持

本项目完全开源，开源的目的是打消大家对于安全性的疑虑。
此项目也作为后续本人作为小程序教学的案例，需要学习做小程序的朋友，来小红书找[@要一直开心啊](https://www.xiaohongshu.com/user/profile/610e50bd00000000010088fd)。

## 核心功能
1. 密码管理：
   - 添加/编辑/删除密码记录
   - 密码搜索功能
   - 密码复制功能
2. 安全特性：
   - AES-256加密存储
   - 主密码验证机制
   - 5天内免登录
3. 用户支持：
   - 问题反馈
   - 技术支持
   - 使用说明

## 技术架构
- 前端：微信小程序原生开发
- 后端：微信云开发
- 加密：CryptoJS包 AES-256 本地加密
- 数据存储：云端加密存储
- 版本控制：Git

## 目录结构

```
.
├── README.md
├── cloudfunctions  (云函数目录=小程序后端接口)
│   ├── bugManage   (问题反馈的云函数，对应数据库表bug_list)
│   ├── psdRecordsManage （密码记录的云函数，对应数据库表psd_records）
│   └── psdUserManage （用户信息的云函数，对应数据库表psd_users）
├── database.d.ts (数据库表的详细定义文件)
├── miniprogram  （微信小程序前端源码目录）
│   ├── api.js  （所有用到的后端接口）
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── constant.js （常量定义文件）
│   ├── env.example.js  （环境变量的示例文件，需改名为 env.js）
│   ├── env.js  （正式环境的环境变量文件，此文件不在版本控制）
│   ├── envList.js
│   ├── images
│   ├── miniprogram_npm （微信小程序npm依赖目录，加密库crypto-js）
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── pages （微信小程序页面目录）
│   ├── sitemap.json
│   └── utils.js （工具函数文件）
├── project.config.json
└── project.private.config.json
```

## 安全性保障
1. 加密机制：
   - 客户端AES-256加密,加密key是用户的主密码
   - 主密码本地自行存储，不上云
   - 加密数据存储，账号/密码/描述，全部加密后上云
2. 安全建议：
   - 不要泄露主密码
   - 定期修改主密码
   - 启用5天内免登录功能

## 部署说明
1. 环境要求：
   - Node.js 16+
   - 微信开发者工具
   - 微信云开发环境
2. 安装步骤：
   - 克隆项目仓库
   - 用微信开发者工具打开项目
   - 创建两张数据库表`psd_records`、`psd_users`
   - 修改`env.example.js`为`env.js`，并配置为自己的环境信息
   - 构建运行查看效果
   - 使用微信开发者工具上传发布

## 贡献指南
欢迎贡献代码，请遵循以下流程：
1. Fork项目仓库
2. 创建特性分支
3. 提交Pull Request
4. 通过代码审查后合并

## 开源协议
本项目采用 Apache 2.0 开源协议，详情请查看 [LICENSE](LICENSE) 文件。

## 关注与支持
如果本项目对你有帮助，欢迎：
- 给项目点个 ⭐️
- 将项目分享给更多需要的人
- 关注我的小红书 [@要一直开心啊](https://www.xiaohongshu.com/user/profile/610e50bd00000000010088fd)
- 或者，请我喝杯咖啡

<img src="./miniprogram/images/wx.jpeg" width=160 />
<img src="./miniprogram/images/zfb.jpeg" width=160 />

## 感谢/参考文档
- [微信小程序开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)
- [微信小程序前端-开发指南](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信小程序后端-云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/basis/getting-started.html)
- [WeUI官方组件库](https://weui.io/)
