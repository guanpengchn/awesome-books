## 如何生成目录README.md

1. 在generate.js中的books变量相应类别中添加新书的ISBN号码

2. 执行指令

```js
cd .helper
// 生成db.json
node generate.js db
// 根据db.json生成README.md
node generate.js md
```