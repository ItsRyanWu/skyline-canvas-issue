# How to run

```sh

npm install

npm run serve

```

问题表现：

iOS + Skyline: Canvas 在页面初次挂载时启动渲染，有很大几率崩溃。（若加 1s setTimeout 延迟则不会崩溃）
iOS + Webview: Canvas 渲染正常
Android + Skyline: Canvas 渲染正常
Android + Webview: Canvas 渲染正常

目前临时解决方法：

```javascript
onReady() {
  setTimeout(() => {
    renderCanvas()
  }, 1000) // 加延迟等待 Canvas 完全初始化后再执行渲染逻辑
}
```

正常表现（Canvas Webview iOS）：

https://github.com/ItsRyanWu/skyline-canvas-issue/assets/17338101/4590682a-1cbf-4e55-b094-335853b1f525

异常表现（Canvas Skyline iOS)：

https://github.com/ItsRyanWu/skyline-canvas-issue/assets/17338101/f45497f8-a193-4d62-821d-a0f9409d2b0b

报错信息：
![image](https://github.com/ItsRyanWu/skyline-canvas-issue/assets/17338101/419f1f5e-4d7d-4c57-ae09-2bedc2878196)
![image](https://github.com/ItsRyanWu/skyline-canvas-issue/assets/17338101/738dcb70-c58a-4e2e-ac81-e32900269da0)

