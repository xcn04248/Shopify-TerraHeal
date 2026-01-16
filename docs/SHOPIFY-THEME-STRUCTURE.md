# Shopify 主题目录结构与文件命名规范

> 基于 [Shopify 官方文档](https://shopify.dev/docs/storefronts/themes/architecture)

---

## 标准目录结构

Shopify 主题**只识别以下目录**，其他目录会被忽略：

```
your-theme/
├── assets/           # 静态资源 (⚠️ 不支持子目录)
├── blocks/           # 可重用的块组件 (OS 2.0+)
├── config/           # 配置文件
├── layout/           # 布局文件 (必须包含 theme.liquid)
├── locales/          # 翻译文件
├── sections/         # 可重用的内容模块
├── snippets/         # 小型代码片段
└── templates/        # 页面模板
    └── customers/    # 客户账户页面模板 (唯一允许的子目录)
```

---

## 各目录详解

### 1. `layout/` - 布局文件

| 文件 | 用途 | 必需 |
|------|------|------|
| `theme.liquid` | 主布局文件，所有页面的基础框架 | ✅ 必需 |
| `password.liquid` | 商店密码保护页面布局 | 可选 |
| `checkout.liquid` | 结账页面布局 (仅 Shopify Plus) | 可选 |

**命名规范**: `{name}.liquid`

---

### 2. `templates/` - 页面模板

控制每种页面类型渲染的内容。

| 模板类型 | 文件名示例 | 用途 |
|----------|-----------|------|
| 首页 | `index.json` | 商店首页 |
| 产品页 | `product.json` | 产品详情页 |
| 集合页 | `collection.json` | 产品集合/分类页 |
| 博客页 | `blog.json` | 博客列表页 |
| 文章页 | `article.json` | 博客文章详情页 |
| 普通页面 | `page.json` | 自定义页面 |
| 购物车 | `cart.json` | 购物车页面 |
| 搜索 | `search.json` | 搜索结果页 |
| 404 | `404.json` | 页面未找到 |
| 礼品卡 | `gift_card.liquid` | 礼品卡页面 |

**命名规范**:
- 格式: `{type}.json` 或 `{type}.{suffix}.json`
- 备用模板: `page.contact.json`, `product.featured.json`
- 子目录：仅 `templates/customers/` 是允许的

**客户页面模板** (`templates/customers/`):
| 文件 | 用途 |
|------|------|
| `account.liquid` | 客户账户概览 |
| `login.liquid` | 登录页面 |
| `register.liquid` | 注册页面 |
| `order.liquid` | 订单详情 |
| `addresses.liquid` | 地址管理 |
| `reset_password.liquid` | 重置密码 |
| `activate_account.liquid` | 激活账户 |

---

### 3. `sections/` - 内容模块

可由商家在主题编辑器中添加、删除、重新排序的模块。

**命名规范**:
- 格式: `{section-name}.liquid`
- 使用连字符分隔: `featured-collection.liquid`, `image-banner.liquid`
- Section Groups: `header-group.json`, `footer-group.json`

**示例**:
```
sections/
├── header.liquid
├── footer.liquid
├── featured-collection.liquid
├── image-banner.liquid
├── rich-text.liquid
├── header-group.json      # Section Group
└── footer-group.json      # Section Group
```

---

### 4. `snippets/` - 代码片段

小型可重用 Liquid 代码，在主题编辑器中不可见。

**命名规范**:
- 格式: `{snippet-name}.liquid`
- 使用连字符分隔: `product-card.liquid`, `icon-cart.liquid`

**示例**:
```
snippets/
├── product-card.liquid
├── price.liquid
├── icon-cart.liquid
├── social-icons.liquid
└── swatch-input.liquid
```

---

### 5. `assets/` - 静态资源

⚠️ **重要规则**：
- **不支持子目录** - 所有文件必须在根目录
- 使用 `asset_url` filter 引用：`{{ 'style.css' | asset_url }}`

**命名规范**:
- 使用连字符或下划线分隔
- 添加前缀组织文件：`lp-hero-image.png`, `section-banner.css`
- Liquid 处理：添加 `.liquid` 后缀，如 `style.css.liquid`

**允许的文件类型**:
| 类型 | 扩展名 |
|------|--------|
| 图片 | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.ico` |
| 样式 | `.css`, `.scss`, `.css.liquid` |
| 脚本 | `.js`, `.js.liquid` |
| 字体 | `.woff`, `.woff2`, `.ttf`, `.eot` |
| 视频 | `.mp4`, `.webm` |
| 其他 | `.json`, `.liquid` |

**示例**:
```
assets/
├── base.css
├── component-card.css
├── lp-hero-01-banner.png        # ✅ 使用前缀组织
├── lp-hero-02-product.jpg
├── section-announcement.js
└── theme.js
```

---

### 6. `config/` - 配置文件

| 文件 | 用途 |
|------|------|
| `settings_schema.json` | 定义主题编辑器中的设置选项 |
| `settings_data.json` | 存储商家选择的设置值 (通常 gitignore) |

---

### 7. `locales/` - 翻译文件

**命名规范**: `{语言代码}.json` 或 `{语言代码}.default.json`

**示例**:
```
locales/
├── en.default.json    # 英语 (默认)
├── zh-CN.json         # 简体中文
├── zh-TW.json         # 繁体中文
├── ja.json            # 日语
└── de.json            # 德语
```

---

### 8. `blocks/` - 块组件 (OS 2.0+)

独立的可重用块，可在多个 section 中使用。

**命名规范**: `{block-name}.liquid`

---

## 文件命名最佳实践

### ✅ 推荐

```
# 使用连字符分隔单词
featured-collection.liquid
image-with-text.liquid

# 使用前缀组织 assets
lp-hero-banner.png
section-announcement.css
icon-cart.svg

# 备用模板使用点号分隔
page.contact.json
product.featured.json
```

### ❌ 避免

```
# 不要使用空格
Featured Collection.liquid  ❌

# 不要使用驼峰命名
featuredCollection.liquid   ❌

# 不要在 assets 中使用子目录
assets/images/hero.png      ❌  (子目录会被忽略)

# 不要使用特殊字符
section@banner.liquid       ❌
```

---

## GitHub 同步注意事项

当使用 Shopify GitHub 集成时：

1. **只同步标准目录** - 非标准目录会被忽略
2. **根目录非主题文件会被忽略** - 如 `README.md`、`.gitignore`
3. **assets 子目录被忽略** - 所有资源必须在 `assets/` 根目录
4. **模板名称决定可用性** - `page.{suffix}.json` 会在页面编辑器中显示为模板选项

---

## 完整示例结构

```
my-theme/
├── assets/
│   ├── base.css
│   ├── component-card.css
│   ├── lp-hero-banner.png
│   ├── lp-product-mat.jpg
│   ├── section-announcement.js
│   └── theme.js
├── blocks/
│   └── price-block.liquid
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
│   ├── theme.liquid           # ✅ 必需
│   └── password.liquid
├── locales/
│   ├── en.default.json
│   └── zh-CN.json
├── sections/
│   ├── header.liquid
│   ├── footer.liquid
│   ├── featured-collection.liquid
│   ├── header-group.json
│   └── footer-group.json
├── snippets/
│   ├── product-card.liquid
│   ├── price.liquid
│   └── icon-cart.liquid
└── templates/
    ├── index.json
    ├── product.json
    ├── product.featured.json
    ├── collection.json
    ├── page.json
    ├── page.contact.json
    ├── page.adv-ly1-gm.json    # 自定义广告页模板
    └── customers/
        ├── account.liquid
        ├── login.liquid
        └── order.liquid
```

---

## 参考链接

- [Theme Architecture - Shopify.dev](https://shopify.dev/docs/storefronts/themes/architecture)
- [Dawn Theme (官方示例)](https://github.com/Shopify/dawn)
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
