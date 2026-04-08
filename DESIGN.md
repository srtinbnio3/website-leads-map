# DESIGN.md — WebsiteLeadsMap

> このファイルはAIエージェントが正確な日本語UIを生成するためのデザイン仕様書です。
> セクションヘッダーは英語、値の説明は日本語で記述しています。

---

## 1. Visual Theme & Atmosphere

- **デザイン方針**: 地図ツール特化。Google Maps ライクな情報密度の高い業務UI
- **密度**: 高密度 — 地図パネルとリストパネルが並列表示。限られたスペースに多くの情報を整理して提示する
- **コア体験**: 検索・探索がメイン。CRM管理はサブ
- **キーワード**: 機能的、情報密度、地図中心、信頼感、プロフェッショナル

---

## 2. Color Palette & Roles

shadcn/ui の CSS 変数ベースで定義。HSL 形式で記述。

### Primary（ブランドカラー — ブルー系）

地図ツールとの親和性、信頼感・プロフェッショナル感を表現するブルー。

- **Primary** (`hsl(215, 80%, 52%)` / `#2563EB`): メインのブランドカラー。CTAボタン、アクティブリンク、選択中マーカーに使用
- **Primary Foreground** (`hsl(0, 0%, 100%)` / `#FFFFFF`): Primary 上のテキスト

### Semantic（意味的な色）

websiteUri 判定結果や CRM ステータスの色分けに使用。

- **Danger** (`hsl(0, 72%, 51%)` / `#DC2626`): エラー、削除、「対象外」ステータス
- **Warning** (`hsl(38, 92%, 50%)` / `#F59E0B`): 警告、「未対応」ステータス
- **Success** (`hsl(142, 71%, 45%)` / `#16A34A`): 成功、「保守契約」ステータス、「独自ホームページ」判定
- **Info** (`hsl(215, 80%, 52%)` / `#2563EB`): 情報、「営業済」ステータス（※ Primary と同一色。意図的にブランドカラーと統一している）

### Website判定バッジカラー

| 判定 | Background | Text | 意味 |
|------|-----------|------|------|
| `none` | `hsl(0, 72%, 95%)` | `hsl(0, 72%, 40%)` | 未登録（赤系） |
| `sns_only` | `hsl(38, 92%, 95%)` | `hsl(38, 92%, 35%)` | SNSのみ（オレンジ系） |
| `external_media_only` | `hsl(215, 80%, 95%)` | `hsl(215, 80%, 40%)` | 外部媒体のみ（ブルー系） |
| `has_own_website` | `hsl(142, 71%, 95%)` | `hsl(142, 71%, 35%)` | 独自サイト所有（グリーン系） |

### CRMステータスカラー

| ステータス | Background | Text |
|-----------|-----------|------|
| 未対応 | `hsl(220, 14%, 96%)` | `hsl(220, 14%, 40%)` |
| 営業済 | `hsl(215, 80%, 95%)` | `hsl(215, 80%, 40%)` |
| 返信あり | `hsl(142, 71%, 95%)` | `hsl(142, 71%, 35%)` |
| 対象外 | `hsl(0, 72%, 95%)` | `hsl(0, 72%, 40%)` |
| 保守契約 | `hsl(262, 83%, 95%)` | `hsl(262, 83%, 40%)` |

### Neutral（ニュートラル — Slate 系）

地図UIでは Slate 系のクールグレーが視認性に優れる。

#### Light Mode

```css
:root {
  --background: 210 20% 98%;        /* #F8FAFC ページ背景 */
  --foreground: 222 47% 11%;        /* #0F172A 本文テキスト */
  --card: 0 0% 100%;                /* #FFFFFF カード、パネル */
  --card-foreground: 222 47% 11%;   /* #0F172A カード内テキスト */
  --popover: 0 0% 100%;             /* #FFFFFF ポップオーバー */
  --popover-foreground: 222 47% 11%;
  --primary: 215 80% 52%;           /* #2563EB ブランドカラー */
  --primary-foreground: 0 0% 100%;  /* #FFFFFF */
  --secondary: 210 40% 96%;         /* #F1F5F9 */
  --secondary-foreground: 222 47% 11%;
  --muted: 210 40% 96%;             /* #F1F5F9 */
  --muted-foreground: 215 16% 47%;  /* #64748B 補足テキスト */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;
  --destructive: 0 72% 51%;         /* #DC2626 */
  --destructive-foreground: 0 0% 100%;
  --border: 214 32% 91%;            /* #E2E8F0 */
  --input: 214 32% 91%;
  --ring: 215 80% 52%;              /* フォーカスリング = Primary */
  --radius: 0.5rem;
}
```

#### Dark Mode

```css
.dark {
  --background: 222 47% 6%;         /* #0B1120 */
  --foreground: 210 40% 98%;        /* #F8FAFC */
  --card: 222 47% 9%;               /* #111827 */
  --card-foreground: 210 40% 98%;
  --popover: 222 47% 9%;
  --popover-foreground: 210 40% 98%;
  --primary: 215 80% 56%;           /* #3B82F6 やや明るめ */
  --primary-foreground: 0 0% 100%;
  --secondary: 217 33% 17%;         /* #1E293B */
  --secondary-foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;  /* #94A3B8 */
  --accent: 217 33% 17%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62% 40%;
  --destructive-foreground: 210 40% 98%;
  --border: 217 33% 20%;            /* #334155 */
  --input: 217 33% 20%;
  --ring: 215 80% 56%;
}
```

---

## 3. Typography Rules

### 3.1 和文フォント

- **ゴシック体**: Noto Sans JP（Google Fonts）
- 明朝体は使用しない

### 3.2 欧文フォント

- **サンセリフ**: Geist（既存採用）
- **等幅**: Geist Mono（既存採用）

### 3.3 font-family 指定

```css
/* 本文・UI */
font-family: "Geist", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", sans-serif;

/* 等幅（コード、データ表示） */
font-family: "Geist Mono", "Noto Sans Mono", monospace;
```

**フォールバックの考え方**:
- Geist を先に指定（欧文の表示品質を優先。Geist の欧文グリフは Noto Sans JP 内蔵の欧文より美しい）
- 和文は Noto Sans JP → ヒラギノ → メイリオ の順（Web → macOS → Windows）
- 最後に generic family `sans-serif` を指定

### 3.4 文字サイズ・ウェイト階層

| Role | Font | Size | Weight | Line Height | Letter Spacing | 備考 |
|------|------|------|--------|-------------|----------------|------|
| Display | Geist + Noto Sans JP | 30px | 700 | 1.3 | -0.02em | ページタイトル（使用箇所少） |
| Heading 1 | Geist + Noto Sans JP | 24px | 700 | 1.4 | -0.01em | セクション見出し |
| Heading 2 | Geist + Noto Sans JP | 20px | 600 | 1.4 | 0 | サブ見出し |
| Heading 3 | Geist + Noto Sans JP | 16px | 600 | 1.5 | 0 | 小見出し、パネルヘッダー |
| Body | Geist + Noto Sans JP | 14px | 400 | 1.7 | 0.04em | 本文、説明テキスト |
| Caption | Geist + Noto Sans JP | 12px | 400 | 1.6 | 0.04em | 補足、距離表示、住所 |
| Small | Geist + Noto Sans JP | 11px | 400 | 1.5 | 0.02em | バッジ内テキスト、最小注釈 |

**地図ツール特有の補足**:
- Body は 14px を基本サイズとする（情報密度を確保しつつ可読性を維持）
- カード内のビジネス名は Heading 3 (16px/600)、住所・カテゴリは Caption (12px)
- 距離表示は Caption (12px) + muted-foreground

### 3.5 行間・字間

- **本文の行間 (line-height)**: 1.7（日本語の可読性を確保）
- **見出しの行間**: 1.3〜1.4（コンパクトに）
- **本文の字間 (letter-spacing)**: 0.04em（全角文字の可読性向上）
- **見出しの字間**: -0.02em〜0em（タイトルは詰め気味に）

### 3.6 禁則処理・改行ルール

```css
/* 推奨設定 */
word-break: break-all;
overflow-wrap: break-word;
line-break: strict;
```

**禁則対象**:
- 行頭禁止: `）」』】〕〉》」【、。，．・：；？！`
- 行末禁止: `（「『【〔〈《「【`

**地図ツール特有**:
- 住所テキストは `word-break: keep-all` で地名の途中での改行を避ける
- ビジネス名が長い場合は `text-overflow: ellipsis` で1行に収める

### 3.7 OpenType 機能

```css
/* 見出し・ナビゲーション */
font-feature-settings: "palt" 1, "kern" 1;

/* 本文 */
font-feature-settings: "kern" 1;
```

- **palt**: 見出しやボタンラベルに適用。プロポーショナル字詰めで引き締まった印象に
- **kern**: 全テキストに適用。和欧混植時のカーニングを最適化
- 本文には `palt` を適用しない（等幅の方が可読性が高い）

---

## 4. Component Stylings

shadcn/ui + Tailwind CSS ベース。CSS 変数を参照する。

### Buttons

**Primary（CTA）**
- Background: `hsl(var(--primary))`
- Text: `hsl(var(--primary-foreground))`
- Padding: 8px 16px (`h-9 px-4 py-2`)
- Border Radius: 6px (`rounded-md`)
- Font Size: 14px
- Font Weight: 500
- Hover: `opacity 0.9`
- 用途: 検索実行、リード保存、ログイン

**Secondary**
- Background: `hsl(var(--secondary))`
- Text: `hsl(var(--secondary-foreground))`
- Padding: 8px 16px
- Border Radius: 6px
- 用途: フィルタ、ソート、サブアクション

**Outline**
- Background: `transparent`
- Text: `hsl(var(--foreground))`
- Border: 1px solid `hsl(var(--input))`
- Padding: 8px 16px
- Border Radius: 6px
- 用途: キャンセル、リセット

**Destructive**
- Background: `hsl(var(--destructive))`
- Text: `hsl(var(--destructive-foreground))`
- 用途: リード削除、「対象外」マーク

**Ghost**
- Background: `transparent`
- Hover Background: `hsl(var(--accent))`
- 用途: ツールバーアイコン、地図コントロール

**Icon Button**
- Size: 36px x 36px (`h-9 w-9`)
- Border Radius: 6px
- 用途: マップズーム、閉じるボタン

### Inputs

- Background: `transparent`
- Border: 1px solid `hsl(var(--input))`
- Border (focus): 1px solid `hsl(var(--ring))`
- Border Radius: 6px
- Padding: 4px 12px (`px-3 py-1`)
- Font Size: 14px (デスクトップ) / 16px (モバイル)
- Height: 36px (`h-9`)
- Placeholder: `hsl(var(--muted-foreground))`
- 用途: 検索バー、メモ入力、地点検索

### Cards（BusinessCard）

- Background: `hsl(var(--card))`
- Border: 1px solid `hsl(var(--border))`
- Border Radius: 12px (`rounded-xl`)
- Padding: 24px (`p-6`)
- Shadow: `0 1px 2px rgba(0,0,0,0.05)`
- Hover: `border-color: hsl(var(--primary) / 0.3)` で選択可能であることを示唆
- Selected: `border-color: hsl(var(--primary))` + `shadow: 0 0 0 1px hsl(var(--primary))`
- 用途: ビジネス情報カード、リードカード

### Badges

- Border Radius: 6px (`rounded-md`)
- Padding: 2px 10px (`px-2.5 py-0.5`)
- Font Size: 12px (`text-xs`)
- Font Weight: 600
- 用途: websiteUri 判定結果、CRM ステータス（色は Section 2 参照）

### Select / Dropdown

- Background: `hsl(var(--popover))`
- Border: 1px solid `hsl(var(--border))`
- Border Radius: 6px
- Shadow: `0 4px 8px rgba(0,0,0,0.1)`
- Item Hover: `hsl(var(--accent))`
- 用途: 業種フィルタ、ステータス変更

### Dialog / Modal

- Background: `hsl(var(--card))`
- Overlay: `rgba(0, 0, 0, 0.5)`
- Border Radius: 12px
- Padding: 24px
- Shadow: `0 8px 24px rgba(0,0,0,0.15)`
- Max Width: 425px
- 用途: ログインモーダル、メモ編集

### Tabs

- Active Tab: `border-bottom: 2px solid hsl(var(--primary))`, `color: hsl(var(--foreground))`
- Inactive Tab: `color: hsl(var(--muted-foreground))`
- 用途: 検索結果 / 保存済みリード 切り替え

---

## 5. Layout Principles

### Spacing Scale

Tailwind のデフォルトスペーシングを使用。

| Token | Value | 用途 |
|-------|-------|------|
| XS | 4px (`gap-1`) | アイコンとテキストの間 |
| S | 8px (`gap-2`) | バッジ間、インライン要素 |
| M | 16px (`gap-4`) | カード内セクション間 |
| L | 24px (`gap-6`) | カード間、パネル内パディング |
| XL | 32px (`gap-8`) | セクション間 |

### メインレイアウト（2パネル構成）

```
┌─────────────────────────────────────────────────────┐
│ Header (SearchBar)                          h: 56px │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  BusinessPanel       │       MapPanel               │
│  (リスト)             │       (Google Maps)           │
│  w: 400px            │       flex: 1                │
│                      │                              │
│  - SearchResults     │       - Markers              │
│  - LeadsList         │       - InfoWindow           │
│  - BusinessCards     │       - Controls             │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
```

- **BusinessPanel**: 固定幅 400px、左側配置、スクロール可能
- **MapPanel**: 残り幅を占有 (`flex: 1`)、右側配置
- **Header**: 高さ 56px、検索バーを含む

### Container

- Max Width: なし（全画面使用。地図ツールのため）
- Padding (horizontal): 0px（パネルが画面端まで）

---

## 6. Depth & Elevation

| Level | Shadow | 用途 |
|-------|--------|------|
| 0 | `none` | フラットな要素、地図上のオーバーレイ背景 |
| 1 | `0 1px 2px rgba(0,0,0,0.05)` | カード、パネル |
| 2 | `0 4px 8px rgba(0,0,0,0.1)` | ドロップダウン、ポップオーバー、地図上のInfoWindow |
| 3 | `0 8px 24px rgba(0,0,0,0.15)` | モーダル、ダイアログ |

**地図ツール特有**:
- 地図上に浮かぶUI要素（検索バー、ズームコントロール）は Level 2 を使用
- BusinessPanel は地図と同じ高さ（Level 1）で、視覚的に対等な関係を示す

**ダークモード Shadow（opacity 増加）**:

| Level | Shadow (Dark) |
|-------|---------------|
| 0 | `none` |
| 1 | `0 1px 2px rgba(0,0,0,0.2)` |
| 2 | `0 4px 8px rgba(0,0,0,0.3)` |
| 3 | `0 8px 24px rgba(0,0,0,0.4)` |

---

## 7. Do's and Don'ts

### Do（推奨）

- `font-family` は必ずフォールバックチェーンを指定する（Geist → Noto Sans JP → ヒラギノ → メイリオ → sans-serif）
- 日本語本文の `line-height` は 1.7 以上にする
- 色のコントラスト比は WCAG AA 以上を確保する（特に地図上のテキスト）
- コンポーネントの余白は Spacing Scale に従う
- websiteUri 判定結果とCRMステータスは必ず色付きバッジで表示する
- 地図上のマーカーはクリック可能であることが視覚的に分かるようにする
- カードのホバー状態で border-color を変化させ、インタラクティブであることを示す
- shadcn/ui の CSS 変数 (`hsl(var(--xxx))`) を直接使用する

### Don't（禁止）

- `font-family` に和文フォント1つだけを指定しない（環境依存になる）
- 日本語本文に `line-height: 1.2` 以下を使わない（可読性が著しく低下する）
- 全角・半角スペースを混在させない
- テキストの色に純粋な `#000000` を使わない（コントラストが強すぎる。`--foreground` を使う）
- ハードコードした色値を使わない（必ず CSS 変数を経由する）
- 地図パネルに固定幅を設定しない（常に `flex: 1` で残り幅を使う）
- BusinessPanel の幅を 400px 未満にしない（カード内の情報が読みにくくなる）
- バッジの色をセマンティックカラー以外にしない（判定結果との対応が崩れる）

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | 説明 |
|------|-------|------|
| Mobile | ≤ 768px | パネル縦積み（リスト → 地図）|
| Desktop | > 768px | 2パネル並列（リスト + 地図） |

### タッチターゲット

- 最小サイズ: 44px x 44px（WCAG基準）
- 地図上のマーカー: 最小 32px x 32px + タッチ領域 44px x 44px

### モバイル時のレイアウト

```
┌──────────────────────┐
│ Header (SearchBar)   │
├──────────────────────┤
│                      │
│  MapPanel            │
│  h: 50vh             │
│                      │
├──────────────────────┤
│                      │
│  BusinessPanel       │
│  h: 50vh (scroll)    │
│                      │
└──────────────────────┘
```

### フォントサイズの調整

- モバイルでは Input の font-size を 16px に維持（iOS のズーム防止）
- 見出しはデスクトップの 85% 程度に縮小

---

## 9. Agent Prompt Guide

### クイックリファレンス

```
Primary Color: hsl(215, 80%, 52%) / #2563EB
Primary Dark (hover): hsl(215, 80%, 47%)
Text Color: hsl(222, 47%, 11%) / #0F172A (light) | hsl(210, 40%, 98%) / #F8FAFC (dark)
Background: hsl(210, 20%, 98%) / #F8FAFC (light) | hsl(222, 47%, 6%) / #0B1120 (dark)
Card Background: #FFFFFF (light) | hsl(222, 47%, 9%) / #111827 (dark)
Border: hsl(214, 32%, 91%) / #E2E8F0 (light) | hsl(217, 33%, 20%) / #334155 (dark)
Font: "Geist", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", sans-serif
Mono: "Geist Mono", "Noto Sans Mono", monospace
Body Size: 14px
Body Line Height: 1.7
Body Letter Spacing: 0.04em
Border Radius: 6px (buttons/inputs) | 12px (cards/modals)
```

### プロンプト例

```
このサービスのデザインシステムに従って、検索結果のビジネスカードを作成してください。
- フォント: "Geist", "Noto Sans JP", sans-serif
- ビジネス名: 16px / font-weight: 600 / line-height: 1.5
- 住所・カテゴリ: 12px / color: hsl(var(--muted-foreground))
- 距離表示: 12px / color: hsl(var(--muted-foreground))
- websiteUri バッジ: rounded-md / text-xs / font-semibold / 色は判定結果に対応
- カード: bg-card / border / rounded-xl / p-6 / shadow-sm
- ホバー: border-color を primary/30 に変化
- letter-spacing: 本文 0.04em
```

```
このサービスのデザインシステムに従って、CRMステータス変更ドロップダウンを作成してください。
- shadcn/ui の Select コンポーネントを使用
- 各ステータスに対応する色付きバッジを表示
- フォント: "Geist", "Noto Sans JP", sans-serif
- ドロップダウン背景: hsl(var(--popover))
- ボーダー: hsl(var(--border))
- シャドウ: Level 2 (0 4px 8px rgba(0,0,0,0.1))
- ステータスカラーは Section 2「CRMステータスカラー」を参照
```

```
このサービスのデザインシステムに従って、地図上のInfoWindowを作成してください。
- 背景: hsl(var(--card))
- シャドウ: Level 2
- ボーダー半径: 12px
- ビジネス名: 16px / 600
- 住所: 12px / muted-foreground
- websiteUri バッジ: Section 2「Website判定バッジカラー」を参照
- 「保存」ボタン: Primary スタイル
- line-height: 1.7 / letter-spacing: 0.04em
```

---
