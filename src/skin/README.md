# 皮肤

分为两部分, scss/libs, 用于存放皮肤定义

## scss

1. 皮肤文件会注入到【每一个 scss 文件】里
2. **自动设置的别名**下都可以有皮肤文件夹, 就近原则覆盖
3. 自动识别皮肤目录下的`.scss`文件 和 包含`index.scss`文件的文件夹 为皮肤
4. 出现覆盖时, 若只有`index.scss`将覆盖全部皮肤

推荐目录结构:

```bash
src
├── skin # 全局皮肤文件夹
│   ├── foo.scss # 皮肤: foo
│   ├── bar # 皮肤: bar
│   │   ├── index.scss
│   ...
├── pages
│   ├── foo # 入口: foo
│   │   ├── skin
│   │   │     ├── foo.scss # 皮肤: foo 覆盖src/skin的foo
│   │   ...
│   ├── bar # 入口: bar
│   │   ├── skin
│   │   │     ├── index.scss # 覆盖所有皮肤
```

## libs

第三方库(数据可视化库)皮肤定义
