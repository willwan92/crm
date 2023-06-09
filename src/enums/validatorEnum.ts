// 8-16位字母和数字的组合
export const PWD_REGEXP = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,16}$/;

// 手机号正则表达式
export const MOBILE_REGEXP = /^1[3-9]\d{9}$/;

// 正整数表达式
export const POSITIVE_INT_REGEXP = /^[1-9]\d*$/;

// 整数或1-2位小数
export const POSITIVE_FLOAT_REGEXP = /(^[0-9]+$)|(^[0-9]+[\.]{1}[0-9]{1,2}$)/;


// 邮箱正则表达式
// 邮箱规则：
// 1. 邮箱域名部分规则，同域名规则；
// 2. 邮箱前缀规则：可由字母、数字和`_`和`.`组成，但是只能以字母和数字开头，长度范围2-32
// 3. 邮箱前缀和邮箱域名用`@`分隔
export const EMAIL_REGEXP =
  /^[A-Za-z0-9][\w.]{1,31}@((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/; // IE浏览器不支持反向否定预查?<!
