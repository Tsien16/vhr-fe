/**
 * Created with WebStorm.
 * @author tsien
 * @version 1.0.0
 * @date 2019/10/15 0015 20:43
 */

import { Message } from "element-ui";

export const isNotNullOrBlank = (...args) => {
  for (let i = 0; i < args.length; i++) {
    let argument = args[i];
    if (argument == null || argument === "" || argument === undefined) {
      Message.warning({ message: "数据不能为空!" });
      return false;
    }
  }
  return true;
};
