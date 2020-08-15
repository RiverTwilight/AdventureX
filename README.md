<center>
    <h1>AdventureX</h1>
</center>

## 简介

Demo: [https://game.yungeeker.com](https://game.yungeeker.com)

开源免费的文字游戏网站，你可以使用我们的编辑器创建你自己的游戏，并通过PR或发送邮件来发布你的游戏。网站基于Next.js开发。

本网站最初是送给朋友的一个礼物，后来我加入了编辑器，允许任何人创建并发布游戏。

## 制作游戏

我们提供了图形化[编辑器](https://game.yungeeker.com/editor)来帮助您制作游戏。

游戏核心组成是一个个**模块**，每个模块可以有文案，BGM和多个选项，选项可以指向不同的模块，以此来实现多结局。

### 随机事件

开发中。

### 解谜

开发中。

### 货币

开发中。

### 主题

~~我们提供了几套预置主题，暂不支持自定义主题。有开发能力的朋友可以制作主题并PR。~~

## 发布

所有游戏都保存在`/games/`目录下，在编辑器中导出游戏工程文件，再把文件夹上传到这个目录（Pull Request），等待审核即可。此仓库的任何更新都将自动部署到网站。

## 开发

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.
