# Development Guide - WebsiteLeadsMap

開発者向けガイド。ローカル開発環境の構築から、新機能の追加方法まで解説します。

## 目次

- [ローカル開発環境の構築](#ローカル開発環境の構築)
- [開発ワークフロー](#開発ワークフロー)
- [Convex 関数の追加方法](#convex-関数の追加方法)
- [ドメインリストの拡張](#ドメインリストの拡張)
- [Places API フィールド変更](#places-api-フィールド変更)
- [CRM ステータスの追加・変更](#crm-ステータスの追加変更)
- [テスト実行](#テスト実行)
- [デプロイ](#デプロイ)

---

## ローカル開発環境の構築

### 前提条件

- Node.js 18.0.0 以上
- npm 9.0.0 以上

### セットアップ手順

1. **リポジトリをクローン**

   ```bash
   git clone https://github.com/yourusername/website-leads-map.git
   cd website-leads-map
   ```

2. **依存パッケージをインストール**

   ```bash
   npm install
   ```

3. **Convex を初期化**

   ```bash
   npx convex dev --until-success
   ```

   このコマンドで：
   - Convex プロジェクトを初期化（GitHub/Google 認証を求められます）
   - ローカル `.env.local` に `CONVEX_DEPLOYMENT` が自動追加
   - デプロイキーを保存

4. **環境変数を設定**

   Convex ダッシュボード（https://dashboard.convex.dev）で以下を設定：

   ```
   AUTH_GOOGLE_ID=your_google_oauth_id
   AUTH_GOOGLE_SECRET=your_google_oauth_secret
   GOOGLE_PLACES_API_KEY=your_places_api_key
   ```

   プロジェクトルートの `.env.local` に以下を追加：

   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
   CONVEX_DEPLOYMENT=proj_xxxxx  # 自動設定
   ```

5. **開発サーバーを起動**

   ```bash
   npm run dev
   ```

   フロントエンド（`http://localhost:3000`）とバックエンド（Convex）が並行起動。

---

## 開発ワークフロー

### 標準フロー

1. **ブランチを作成**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **コードを編集**

   開発サーバーが実行中なら、ファイル保存時に自動リロード。

3. **変更をコミット**

   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

4. **テストを実行**（後述）

5. **PR を作成**

   GitHub で main ブランチへのPRを作成。

### ホットリロード

- **フロントエンド**: Next.js の fast refresh が有効
- **バックエンド**: Convex 関数の変更は自動デプロイ（dev モード時）

---

## Convex 関数の追加方法

### ガイドライン

Convex 使用時は以下を必ず確認：
- `convex/_generated/ai/guidelines.md` を読む（重要なルール）
- すべての関数に argument validators を付与
- queries/mutations では `withIndex` を使用（`filter()` 禁止）
- results を制限（`take(N)` か pagination を使用、`collect()` 禁止）

### Query（データ読み取り）の例

ファイル: `convex/myFunction.ts`

```typescript
import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMyItems = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // withIndex を使用（filter 禁止）
    return await ctx.db
      .query("leads")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});
```

### Mutation（データ書き込み）の例

```typescript
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const updateMyItem = mutation({
  args: {
    itemId: v.id("items"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) throw new Error("Not found");

    await ctx.db.patch(args.itemId, { title: args.title });
    return args.itemId;
  },
});
```

### Action（API 呼び出しなど）の例

```typescript
import { v } from "convex/values";
import { action } from "./_generated/server";

export const callExternalAPI = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // fetch() はデフォルトランタイムで利用可能
    const response = await fetch("https://api.example.com/search", {
      method: "POST",
      body: JSON.stringify({ q: args.query }),
      headers: { "Authorization": `Bearer ${process.env.API_KEY}` },
    });

    return await response.json();
  },
});
```

### ポイント

- **Queries**: DB読み取り、リアクティブ
- **Mutations**: DB書き込み、一度限り（action ではなく）
- **Actions**: 外部API呼び出し、認証チェック
- **`getAuthUserId(ctx)`**: queries/mutations で user ownership を得る（actions では不可）
- **`ctx.auth.getUserIdentity()`**: actions で認証確認（`getAuthUserId` が利用不可）

---

## ドメインリストの拡張

### ドメイン判定ファイル

ファイル: `convex/lib/domainAnalysis.ts`

現在のリスト：

```typescript
const SNS_DOMAINS = [
  "instagram.com", "facebook.com", "twitter.com", "x.com",
  "tiktok.com", "youtube.com", "line.me"
];

const EXTERNAL_MEDIA_DOMAINS = [
  "tabelog.com", "hotpepper.jp", "gurunavi.com", "retty.me",
  "jalan.net", "rakuten.co.jp", "minpaku.com", "airbnb.com"
];
```

### ドメインを追加

例：LinkedIn を SNS として追加

```typescript
const SNS_DOMAINS = [
  "instagram.com", "facebook.com", "twitter.com", "x.com",
  "tiktok.com", "youtube.com", "line.me",
  "linkedin.com"  // 追加
];
```

### テスト

ユニットテストで新しいドメイン をテスト（後述の「テスト実行」を参照）。

```typescript
test("LinkedIn URLs return sns_only", () => {
  expect(analyzeWebsiteUri("https://linkedin.com/company/example"))
    .toBe("sns_only");
});
```

---

## Places API フィールド変更

### API 呼び出し箇所

ファイル: `convex/lib/placesApi.ts`

現在のフィールドマスク：

```typescript
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.primaryType",
  "places.nationalPhoneNumber",
  "places.websiteUri"
].join(",");
```

### フィールドを追加

例：営業時間（`regularOpeningHours`）を追加

1. **フィールドマスク を更新**

   ```typescript
   const FIELD_MASK = [
     "places.id",
     "places.displayName",
     "places.formattedAddress",
     "places.location",
     "places.primaryType",
     "places.nationalPhoneNumber",
     "places.websiteUri",
     "places.regularOpeningHours"  // 追加
   ].join(",");
   ```

2. **スキーマを更新**（必要に応じて）

   ファイル: `convex/schema.ts`

   ```typescript
   leads: defineTable({
     // ... 既存フィールド
     openingHours: v.optional(v.any()),  // 追加
   })
   ```

3. **型定義を更新**（TypeScript）

   `convex/places.ts` の戻り値型を更新。

### API 仕様

Places API（New）の詳細：
- 公式ドキュメント: https://developers.google.com/maps/documentation/places/web-service/overview
- Available Fields: https://developers.google.com/maps/documentation/places/web-service/text-search

---

## CRM ステータスの追加・変更

### ステータス定義

ファイル: `convex/schema.ts`

```typescript
status: v.union(
  v.literal("未対応"),
  v.literal("営業済"),
  v.literal("返信あり"),
  v.literal("対象外"),
  v.literal("保守契約")
),
```

### ステータスを追加

例：「ウォーミングアップ中」を追加

1. **スキーマを更新**

   ```typescript
   status: v.union(
     v.literal("未対応"),
     v.literal("営業済"),
     v.literal("返信あり"),
     v.literal("対象外"),
     v.literal("保守契約"),
     v.literal("ウォーミングアップ中")  // 追加
   ),
   ```

2. **`convex/leads.ts` の validator を更新**

   ```typescript
   const CRM_STATUS = v.union(
     v.literal("未対応"),
     v.literal("営業済"),
     v.literal("返信あり"),
     v.literal("対象外"),
     v.literal("保守契約"),
     v.literal("ウォーミングアップ中")  // 追加
   );
   ```

3. **フロントエンド の UI を更新**（必要に応じて）

   `components/LeadStatusBadge.tsx` でステータスの表示スタイルを追加。

### マイグレーション

スキーマ変更後、Convex ダッシュボード で自動スキーマバリデーションが実行されます。既存のリードには自動的に影響しません（新しいステータスを設定する際に使用開始）。

---

## テスト実行

### ユニットテスト（ドメイン分析）

ファイル: `convex/lib/domainAnalysis.test.ts`（vitest + convex-test）

```bash
npm test
```

### テストファイルの例

```typescript
import { describe, it, expect } from "vitest";
import { analyzeWebsiteUri } from "./domainAnalysis";

describe("analyzeWebsiteUri", () => {
  it("returns 'none' for null/undefined", () => {
    expect(analyzeWebsiteUri(null)).toBe("none");
    expect(analyzeWebsiteUri(undefined)).toBe("none");
  });

  it("detects SNS domains", () => {
    expect(analyzeWebsiteUri("https://instagram.com/shop")).toBe("sns_only");
    expect(analyzeWebsiteUri("https://m.facebook.com/page")).toBe("sns_only");
  });

  it("detects external media domains", () => {
    expect(analyzeWebsiteUri("https://tabelog.com/tokyo/..."))
      .toBe("external_media_only");
  });

  it("prevents false positive domain matches", () => {
    // notinstagram.com は instagram.com にマッチしない
    expect(analyzeWebsiteUri("https://notinstagram.com"))
      .toBe("has_own_website");
  });

  it("handles URLs with www prefix", () => {
    expect(analyzeWebsiteUri("https://www.instagram.com/shop"))
      .toBe("sns_only");
  });
});
```

### E2E テスト（フロントエンド）

フロントエンドのテスト環境は別途セットアップが必要。Playwright や Cypress の使用を推奨。

---

## デプロイ

### Vercel へのデプロイ

1. **GitHub リポジトリに push**

   ```bash
   git push origin main
   ```

2. **Vercel を接続**

   - https://vercel.com/new でリポジトリをインポート
   - プロジェクト名を設定
   - Framework は「Next.js」を選択

3. **環境変数を設定**（Vercel ダッシュボード）

   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
   ```

   他の環境変数（`AUTH_GOOGLE_ID` など）は Convex ダッシュボードで管理。

4. **自動デプロイが開始**

   main ブランチへの push で自動デプロイされます。

### Convex へのデプロイ

フロントエンドをデプロイすると、自動的に Convex 関数もプロダクション環境に反映されます。

明示的にデプロイする場合：

```bash
npx convex deploy
```

Convex ダッシュボード（Settings > Environment variables）でプロダクション環境の環境変数を設定してください。

### 本番環境チェックリスト

デプロイ前に確認：

- [ ] すべての環境変数が Convex ダッシュボード で設定されているか
- [ ] Google OAuth の redirect URI が本番ドメインに設定されているか
- [ ] Places API キーが有効か（quota 制限がないか）
- [ ] ローカルテストが通っているか（`npm test`）
- [ ] ログを確認（Convex ダッシュボード > Logs）

---

## トラブルシューティング

### Convex スキーマエラー

エラー: `Schema validation failed`

**対処**:
1. `convex/schema.ts` の構文を確認
2. `npx convex dev` を再起動
3. Convex ダッシュボードで schema を確認

### 認証エラー

エラー: `Not authenticated`

**対処**:
1. Convex ダッシュボード で `AUTH_GOOGLE_ID`/`SECRET` が設定されているか確認
2. ブラウザ cookies を有効化
3. ブラウザキャッシュをクリア（Ctrl+Shift+Del）

### Places API エラー

エラー: `GOOGLE_PLACES_API_KEY not configured`

**対処**:
1. Convex ダッシュボード で環境変数を設定（Settings > Environment variables）
2. `GOOGLE_PLACES_API_KEY` の値が正しいか確認
3. Google Cloud Console で Places API が有効か確認

---

## リソース

- [Convex 公式ドキュメント](https://docs.convex.dev)
- [Convex ガイドライン](convex/_generated/ai/guidelines.md)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Next.js ドキュメント](https://nextjs.org/docs)
