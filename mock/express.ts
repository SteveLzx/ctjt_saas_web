// 本地模拟接口请求
// npm i express fs -g
const express = require('express');
const fs = require('fs');

const apiServer = express();
const apiRouter = express.Router();

const port = 3033;
apiServer.use('/', apiRouter);
apiRouter.all('*', (req, res) => {
  fs.readFile('./mock/mock.json', 'utf8', (err, data) => { // 读取接口文件，mock.json是接口文件名
    if (err) res.send('大兄弟！！！出错啦！！！');
    const timer = setTimeout(() => {
      let dataJson = {};
      try {
        dataJson = JSON.parse(data);
      } catch (e) {
        res.send('大兄弟！！！mock.json文件有错误！！！');
        return;
      }
      if (dataJson[req.path]) {
        res.json(dataJson[req.path]);
      } else {
        res.send('大兄弟！！！你在mock.json里面放接口了吗！！！');
      }
      clearTimeout(timer);
    }, 1000);
  });
});

apiServer.listen(port, err => {
  if (err) {
    return;
  }
  console.log(`Listening at http://localhost:${port}`);
});
