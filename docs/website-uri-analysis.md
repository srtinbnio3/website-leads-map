# websiteUri 解析仕様

## 概要

Google Places API から取得した `websiteUri` を解析し、事業所のウェブサイト保有状況を自動判定する機能。  
実装: `convex/lib/domainAnalysis.ts`

---

## ステータス定義

| ステータス値 | 表示名 | 判定条件 |
|---|---|---|
| `none` | 未登録 | `websiteUri` が null / undefined / 空文字 |
| `sns_only` | SNSのみ | URL ホスト名が SNS ドメインリストと一致 |
| `external_media_only` | 外部媒体のみ | URL ホスト名が外部媒体ドメインリストと一致 |
| `has_own_website` | 独自ホームページあり | 上記いずれにも該当しない |

型定義:
```ts
type WebsiteStatus = "none" | "sns_only" | "external_media_only" | "has_own_website";
```

---

## 判定フロー

```
websiteUri
  │
  ├─ null / undefined / falsy → "none"
  │
  └─ URL からホスト名を抽出（www. プレフィックスを除去）
       │
       ├─ SNS ドメインリストに一致 → "sns_only"
       │
       ├─ 外部媒体ドメインリストに一致 → "external_media_only"
       │
       └─ その他 → "has_own_website"
```

---

## ドメインリスト

### SNS ドメイン（`sns_only`）

| ドメイン | サービス名 |
|---|---|
| instagram.com | Instagram |
| facebook.com | Facebook |
| twitter.com | Twitter（旧） |
| x.com | X（旧 Twitter） |
| tiktok.com | TikTok |
| youtube.com | YouTube |
| line.me | LINE |

### 外部媒体ドメイン（`external_media_only`）

| ドメイン | サービス名 |
|---|---|
| tabelog.com | 食べログ |
| hotpepper.jp | ホットペッパー |
| gurunavi.com | ぐるなび |
| retty.me | Retty |
| jalan.net | じゃらん |
| rakuten.co.jp | 楽天 |
| minpaku.com | 民泊.com |
| airbnb.com | Airbnb |

---

## ドメインマッチングルール

ホスト名の照合は以下の条件で行う：

```
hostname === domain
  OR
hostname.endsWith("." + domain)
```

### 目的

サブドメインを正しくマッチさせつつ、誤検出を防ぐ。

| URL 例 | hostname | マッチ対象 | 結果 |
|---|---|---|---|
| `https://instagram.com/shop` | `instagram.com` | `instagram.com` | ✅ 一致 |
| `https://business.instagram.com` | `business.instagram.com` | `instagram.com` | ✅ 一致（サブドメイン） |
| `https://notinstagram.com` | `notinstagram.com` | `instagram.com` | ❌ 不一致（誤検出防止） |

---

## ホスト名抽出ロジック

```ts
function extractHostname(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
  } catch {
    return url.toLowerCase(); // URL パース失敗時はそのまま小文字化
  }
}
```

- `new URL()` で正規パース
- `www.` プレフィックスを除去して正規化
- パース失敗時（不正な URL）は入力文字列を小文字化してフォールバック

---

## エントリポイント

```ts
export function analyzeWebsiteUri(websiteUri: string | null | undefined): WebsiteStatus
```

呼び出し元: `convex/places.ts`（Places API 検索結果の処理時）

---

## ドメインリスト拡張方法

`convex/lib/domainAnalysis.ts` 内の定数を編集する：

```ts
const SNS_DOMAINS = [...];
const EXTERNAL_MEDIA_DOMAINS = [...];
```

ドメイン追加後、自動的に全ての解析処理へ反映される。
