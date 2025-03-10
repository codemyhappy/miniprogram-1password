/*******************
 * 数据库的设计文档
 *******************/


/**
 * 数据库表的通用字段
 */
interface DbCommon{
  /** 唯一ID */
  _id?: string,
  /** 是否删除 */
  del_flag: boolean,
  /** 创建人 */
  create_by_openid: string,
  /** 创建时间 */
  create_time: number,
  /** 更新时间 */
  update_time: number
}

/**
 * 密码管理 用户表
 */
interface PsdUsers extends DbCommon{
  /** 来源appid */
  FROM_APPID:string,
  /** 加密后的密码，主密码 */
  psd:string,
}

/**
 * 密码管理 记录表
 */
interface PsdRecords extends DbCommon{
  /** 标题 */
  platform: string,
  /** 加密后的账号 */
  account: string,
  /** 加密后的密码，密码 */
  password:string,
  /** 加密后的自定义内容 */
  custom: string
}

/**
 * 用户反馈的bug
 */
interface BugReport extends DbCommon{
  /**
   * 反馈的内容
   */
  content: string

  /**
   * 点赞数量
   */
  starCount: string
}