export enum PageEnum {
  // 登录
  BASE_LOGIN = '/login',
  BASE_LOGIN_NAME = 'Login',
  //重定向
  REDIRECT = '/redirect',
  REDIRECT_NAME = 'Redirect',
  // 管理员首页
  ADMIN_HOME = '/user/index',
  // 高层管理首页
  SENIOR_HOME = '/cockpit/index',
  // 中层管理首页
  MIDDLE_HOME = '/approval/index',
  // 基层员工首页
  BASE_HOME = '/customer/index',
  //首页跳转默认路由
  BASE_HOME_REDIRECT = '/user/index',
  // 错误
  ERROR_PAGE_NAME = 'ErrorPage',
}
