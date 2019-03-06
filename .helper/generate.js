// run on node
const fs = require("fs");
const https = require("https");

const DB_NAME = "db.json";
const README_NAME = "../README.md";

const books = {
  Java: [
    "9787111255833",
    "9787508353937",
    "9787115384881",
    "9787115419347",
    "9787115413765",
    "9787115406095",
    "9787111321545",
    "9787115453686",
    "9787115433145",
    "9787121313011",
    "9787115209429",
    "9787121273049",
    "9787111421900"
  ],
  "C++": ["9787121022982"],
  前端: [
    "9787115470669",
    "9787115416940",
    "9787121238369",
    "9787115350657",
    "9787115388889",
    "9787115275790",
    "9787115352460",
    "9787115447739",
    "9787111488323",
    "9787121229428",
    "9787115349101",
    "9787115385734",
    "9787115431165",
    "9787115471659",
    "9787115299222",
    "9787115437303",
    "9787115335500"
  ],
  机器学习: ["9787302423287", "9787115317957", "9787302275954"],
  算法: [
    "9787121310928",
    "9787115427472",
    "9787302255659",
    "9787115320100",
    "9787302356288",
    "9787121060748",
    "9787115459572"
  ],
  网络: [
    "9787115473899",
    "9787115432728",
    "9787115281487",
    "9787115358851",
    "9787115351531",
    "9787115318978"
  ],
  数据库: [
    "9787115341082",
    "9787115191120",
    "9787111557975",
    "9787111464747",
    "9787115261274",
    "9787121198854"
  ],
  操作系统: [
    "9787115264725",
    "9787115429674",
    "9787564115197",
    "9787115352118",
    "9787115394927",
    "9787111384991",
    "9787115226266"
  ],
  软件工程: ["9787302392644", "9787115221704", "9787115238870"],
  软件测试: ["9787115330246", "9787111173199"],
  架构设计: [
    "9787121315787",
    "9787121271649",
    "9787115473271",
    "9780596521998",
    "9787121249679",
    "9787121212000",
    "9787111430520",
    "9787115420268"
  ],
  编程语言: [
    "9787111526285",
    "9787115445353",
    "9787115290366",
    "9787121328428",
    "9787115355645"
  ],
  运维: ["9787115480170", "9787115449573", "9787115264596"],
  编译原理: ["9787115422187"],
  其他: [
    "9787115394095",
    "9787115317513",
    "9787115404404",
    "9787115400413",
    "9787108011114",
    "9787115483669",
    "9787115465634",
    "9787115482495",
    "9787121139512",
    "9787121123368",
    "9787115392275",
    "9787115295941",
    "9787115293817",
    "9787115249494"
  ]
};

const introduction = `
> 读一本好书，就是在和高尚的人谈话。 ——歌德

## 简介

- 书籍来源：网络收集
- 书籍格式：清晰**带目录**电子书pdf
- 书籍标准：豆瓣评分**7**以上，均为值得**精读**的书籍
- 书籍支持：豆瓣、下载和购买链接

欢迎推荐相同标准书籍

## 目录
`;

// 获取目录标题
function getHead(type) {
  head = `
### ${type}

|书名|豆瓣评分|操作|
|---|:---:|:---:|
`;
  return head;
}

// 从豆瓣获取书籍json
function getBook(url) {
  return new Promise(resolve => {
    let bookInfo = "";
    https.get(url, function(req) {
      req.on("data", function(data) {
        bookInfo += data;
      });
      req.on("end", function() {
        resolve(JSON.parse(bookInfo));
      });
    });
  });
}

// 保存文件
function saveFile(filename, content) {
  fs.writeFile(filename, content, err => {
    if (err) throw err;
    console.log(`${filename} saved!`);
  });
}

// 根据db.json输出README.md
function writeREADME() {
  let content = introduction;

  Object.keys(books).forEach(type => {
    content += getHead(type);
    const isbnArray = books[type];
    isbnArray.forEach(isbn => {
      const db = JSON.parse(fs.readFileSync(DB_NAME));
      const info = db[isbn];
      // 处理标题
      info.title = info.title.includes("/")
        ? info.title.replace("/", "&")
        : info.title;
      info.title = info.title.includes("(")
        ? info.title.replace("(", "（").replace(")", "）")
        : info.title;
      info.subtitle = info.subtitle.includes("/")
        ? info.subtitle.replace("/", "&").trim()
        : info.subtitle.trim();
      info.subtitle = info.subtitle.includes("(")
        ? info.subtitle.replace("(", "（").replace(")", "）")
        : info.subtitle;
      const title =
        info.title.includes(info.subtitle) || !info.subtitle.length
          ? info.title
          : `${info.title} ${info.subtitle}`;
      const encodeTitle = encodeURI(title);
      // 处理种类
      const encodeType = encodeURI(type);
      // 生成一行表格
      const line = `|${title}|[${info.rating.average}](${
        info.alt
      })|[下载](https://github.com/guanpengchn/awesome-books/raw/master/${encodeType}/${encodeTitle}.pdf) [图灵社区](http://search.dangdang.com/?key=${encodeTitle}&act=input) [当当](http://www.ituring.com.cn/search?q=${encodeTitle})|\n`;

      content += line;
    });
  });

  saveFile(README_NAME, content);
}

// 爬取所有书籍内容，输出db.json，注意豆瓣有爬虫限制
async function writeDB() {
  let db = {};
  for (const type of Object.keys(books)) {
    const isbnList = books[type];
    for (const isbn of isbnList) {
      const url = `https://api.douban.com/v2/book/isbn/${isbn}`;
      db[isbn] = await getBook(url);
    }
  }
  saveFile(DB_NAME, JSON.stringify(db));
}

const options = process.argv;
if (options.includes("db")) {
  writeDB();
} else if (options.includes("md")) {
  writeREADME();
}
