# danmu-js

> vue + js 实现的简单不碰撞弹幕

## 预览：

```
npm install
npm run dev
```

http://localhost:8080

## 用法

#### DOM 版：

```
import Manager from './danmu-dom/manager';
const manager = new Manager();

// 发送弹幕
manager.add('this is a message');
// 更新当前dom
manager.on('update', this.updateDanmu);
// 清除所有弹幕
manager.cleanAll();
```

#### Canvas 版：

```
import Manager from './danmu-canvas/manager';
const canvas = document.getElementById('danmu-canvas');
const context = canvas.getContext('2d');
const manager = new Manager(context);
// 发送弹幕
manager.add('this is a message');
// 清除所有弹幕
manager.cleanAll();
```
