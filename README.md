# 八数码问题实验

基于 HTML + CSS + JavaScript（ES Module）的模块化八数码求解演示。

## 功能

- **BFS**：h(n) = 0
- **A\***：不在位数、曼哈顿距离两种启发式
- 固定目标 `1 2 3 / 8 0 4 / 7 6 5`，9 格输入初态
- 随机可解初态、无解提示
- 三列同步单步演示 + Chart.js 节点数对比图

## 本地运行

必须用本地 HTTP 服务（ES Module 不支持 `file://` 直接打开）：

```bash
# 在 src 目录下
python -m http.server 8080
```

浏览器访问：`http://localhost:8080`

也可使用 VS Code **Live Server** 扩展打开 `index.html`。

关闭服务：在运行服务的终端按 `Ctrl + C`。

## 部署 GitHub Pages

1. 将 `src` 文件夹内全部文件推送到 GitHub 仓库。
2. 若仓库根目录就是 `src` 内容：Settings → Pages → 选 `main` 分支 `/ (root)`。
3. 若整仓包含 `src` 子目录：把 `src` 内文件移到仓库根目录或 `docs/`，再发布。

访问：`https://<用户名>.github.io/<仓库名>/`

## 目录结构

```
src/
  index.html
  css/style.css
  js/
    config.js
    state.js
    heuristic.js
    validator.js
    random.js
    priority-queue.js
    solver-astar.js
    solver-bfs.js
    strings-zh.js
    apply-i18n.js
    ui-board.js
    ui-chart.js
    ui-main.js
```

## 默认样例数据

初态（MATLAB bashuma.m）：

```text
7 5 3
1 6 4
2 8 0
```

目标：

```text
1 2 3
8 0 4
7 6 5
```

默认求解结果（本机 Node 测试）：解步数均为 **22**；扩展/生成节点大致为 **曼哈顿 < 不在位数 < BFS**。