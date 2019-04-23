// run on node
const fs = require("fs");
const https = require("https");

const DB_NAME = "db.json";
const README_NAME = "../README.md";
const NOWCODER_README_NAME = "./NOWCODER_README.md";

const books = {
  Java: [
    "9787111255833", // Effective java 中文版（第2版）
    "9787508353937",
    "9787115384881", // Java 8函数式编程
    "9787115419347",
    "9787115413765", // Java性能权威指南
    "9787115406095",
    "9787111321545", // Maven实战
    "9787115453686",
    "9787115433145", // Spring Boot实战
    "9787121313011",
    "9787115209429", // Spring揭秘
    "9787121273049",
    "9787111421900"
  ],
  "C++": [
    "9787121022982"  // 代码大全（第2版）
  ],
  前端: [
    "9787115470669", // CSS世界
    "9787115416940",
    "9787121238369", // ECMAScript6入门
    "9787115458414",
    "9787115350657", // HTML5与CSS3基础教程（第8版）
    "9787115388889",
    "9787115275790", // JavaScript高级程序设计（第3版）
    "9787115352460",
    "9787115447739", // React快速上手开发
    "9787111488323",
    "9787121229428", // WebGL编程指南
    "9787115349101",
    "9787115385734", // 你不知道的JavaScript（上卷）
    "9787115431165",
    "9787115471659", // 你不知道的JavaScript（中卷）
    "9787115299222",
    "9787115437303", // 深入React技术栈
    "9787115335500"
  ],
  机器学习: [
    "9787302423287", // 机器学习
    "9787115317957", 
    "9787302275954"  // 统计学习方法
  ],
  算法: [
    "9787121310928", // 剑指Offer：名企面试官精讲典型编程题（第2版）
    "9787115427472",
    "9787302255659", // 大话数据结构
    "9787115320100",
    "9787302356288", // 算法竞赛入门经典（第2版）
    "9787121060748",
    "9787115459572"  // 趣学算法
  ],
  网络: [
    "9787115473899", // HTTP&2基础教程 让Web性能更上一层楼
    "9787115432728",
    "9787115281487", // HTTP权威指南
    "9787115358851",
    "9787115351531", // 图解HTTP
    "9787115318978"
  ],
  数据库: [
    "9787115341082", // MongoDB权威指南（第2版）
    "9787115191120",
    "9787111557975", // Redis开发与运维
    "9787111464747",
    "9787115261274", // SQL反模式
    "9787121198854"
  ],
  操作系统: [
    "9787115264725", // Linux Shell脚本攻略
    "9787115429674",
    "9787564115197", // LINUX系统编程
    "9787115352118",
    "9787115394927", // 精通Linux（第2版）
    "9787111384991",
    "9787115226266"  // 鸟哥的Linux私房菜 基础学习篇
  ],
  软件工程: [
    "9787302392644", // 人月神话（40周年中文纪念版） 软件工程师经典读本 不可错过的名著
    "9787115221704", 
    "9787115238870"  // 领域驱动设计 软件核心复杂性应对之道
  ],
  软件测试: [
    "9787115330246", // Google软件测试之道 像google一样进行软件测试
    "9787111173199"  // 软件测试的艺术
  ],
  架构设计: [
    "9787121315787", // 分布式服务架构：原理、设计与实战
    "9787121271649",
    "9787115473271", // Kafka权威指南
    "9780596521998",
    "9787121249679", // 从Paxos到Zookeeper 分布式一致性原理与实践
    "9787121212000",
    "9787111430520", // 大规模分布式存储系统 原理解析与架构实战
    "9787115420268"
  ],
  编程语言: [
    "9787111526285", // Go程序设计语言（英文版）
    "9787115445353",
    "9787115290366", // Go语言编程
    "9787121328428",
    "9787115355645"  // 两周自制脚本语言
  ],
  运维: [
    "9787115480170", // DevOps实践指南
    "9787115449573", 
    "9787115264596"  // 持续交付 发布可靠软件的系统方法
  ],
  编译原理: [
    "9787115422187"  // 自制编译器
  ],
  其他: [
    "9787115394095", // GitHub入门与实践
    "9787115276117",
    "9787115317513", // 代码的未来
    "9787115404404",
    "9787115400413", // 函数式编程思维
    "9787115485182", // 别拿相关当因果！因果关系简易入门
    "9787108011114",
    "9787115451699", // 图解物联网
    "9787115483669",
    "9787115465634", // 时间旅行简史
    "9787115482495",
    "9787121139512", // 浪潮之巅
    "9787121123368",
    "9787115392275", // 计算机是怎样跑起来的
    "9787115295941",
    "9787115293817", // 鲜活的数据 数据可视化指南
    "9787115249494"
  ]
};

const introduction = `
> 读一本好书，就是在和高尚的人谈话。 ——歌德

## 简介

- 书籍来源：网络收集
- 书籍格式：清晰**带目录**电子书pdf
- 书籍标准：豆瓣评分**7**以上，均为值得**精读**的书籍
- 书籍支持：豆瓣、下载和图灵社区购买链接

欢迎推荐相同标准书籍

## 目录
`;

const nowcoderIntroduction = `
> 读一本好书，就是在和高尚的人谈话。 ——歌德

## 简介

- 书籍地址：[awesome-books](https://github.com/guanpengchn/awesome-books)
- 书籍来源：网络收集
- 书籍格式：清晰**带目录**电子书pdf
- 书籍标准：豆瓣评分**7**以上，均为值得**精读**的书籍
- 书籍支持：豆瓣、下载、图灵社区购买链接、当当购买链接

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
function writeREADME(hasIcon = true) {
  let content;
  if (hasIcon) {
    content = introduction;
  } else {
    content = nowcoderIntroduction;
  }
  Object.keys(books).forEach(type => {
    content += getHead(type);
    const isbnArray = books[type];
    isbnArray.forEach(isbn => {
      const db = JSON.parse(fs.readFileSync(DB_NAME));
      const info = db[isbn];
      // 处理标题
      if(!info) {
        return;
      }
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
      let line;
      if (hasIcon) {
        line = `|${title}|[${info.rating.average}](${
          info.alt
        })|[![](https://raw.githubusercontent.com/guanpengchn/awesome-books/master/.helper/download.png)](https://github.com/guanpengchn/awesome-books/raw/master/${encodeType}/${encodeTitle}.pdf) [![](https://raw.githubusercontent.com/guanpengchn/awesome-books/master/.helper/buycar.png)](http://www.ituring.com.cn/search?q=${encodeTitle})|\n`;
      } else {
        line = `|${title}|${info.rating.average}|\n`;
      }
      content += line;
    });
  });

  if (hasIcon) {
    saveFile(README_NAME, content);
  } else {
    saveFile(NOWCODER_README_NAME, content);
  }
}

// 爬取所有书籍内容，输出db.json，注意豆瓣有爬虫限制
async function writeDB() {
  const dbStr = fs.readFileSync('db.json');
  const db = JSON.parse(dbStr);
  for (const type of Object.keys(books)) {
    const isbnList = books[type];
    for (const isbn of isbnList) {
      // 如果原有数据库中不存在则加入
      if(!(isbn in db)) {
        console.log(isbn)
        const url = `https://api.douban.com/v2/book/isbn/${isbn}`;
        db[isbn] = await getBook(url);
      }
    }
  }
  saveFile(DB_NAME, JSON.stringify(db));
}

const options = process.argv;
if (options.includes("db")) {
  writeDB();
} else if (options.includes("md")) {
  writeREADME();
} else if (options.includes("nowcoder")) {
  writeREADME(false);
}
