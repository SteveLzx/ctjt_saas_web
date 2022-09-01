// 捕获Promise异常，抛给error事件
window.addEventListener('unhandledrejection', e => {
  throw e.reason;
});

// 监听全局error事件：同步/异步/资源加载
window.addEventListener('error', (args: any) => {
  const error = {
    occurrenceTime: new Date().getTime(), // 发生时间
    message: args.error.message, // 异常信息
    stack: args.error.stack, // 异常栈
    filename: args.filename, // 异常地址
    userAgent: args.target.navigator.userAgent, // 异常设备
    lineno: args.lineno, // 异常行号
    colno: args.colno // 异常列号
  };
  const str = JSON.stringify(error);
  // new Image().src = `http://localhost:3000/json?info=${str}`
  return true;
}, true);
