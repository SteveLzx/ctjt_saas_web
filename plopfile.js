module.exports = plop => {
  plop.setGenerator('vuefile', {
    description: 'create vue file',
    prompts: [
      {
        type: 'checkbox',
        name: 'dirName',
        message: '新建components还是views',
        choices: [
          {
            name: 'views',
            value: 'views',
            checked: true
          },
          {
            name: 'components',
            value: 'components',
            checked: false
          },
        ]
      },
      {
        type: 'input',
        name: 'fileName',
        message: '输入文件夹名称,多层用/隔开',
        default: 'fileName'
      },
      {
        type: 'input',
        name: 'className',
        message: '输入文件类名',
        default: '{{fileName}}'
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{dirName}}/{{fileName}}/index.vue',
        templateFile: './plop_template/index.hbs'
      }
    ]
  });
};
