# WebsiteLeadsMap

Google Maps ライクなUIで営業対象候補を抽出し、そのまま営業管理まで行えるリード生成ツール。

任意地点周辺の事業所を距離順に検索し、Google Maps の `websiteUri` を解析して、ホームページ未設置、SNSのみ掲載、外部ポータル掲載のみの可能性が高い事業所を抽出・保存・管理できます。

## スクリーンショット

[スクリーンショット画像はここに挿入予定]

## 主な機能

### 地図ベース検索（Google Maps ライクUI）

- 任意地点検索（地図上から位置指定）
- 周辺事業所自動取得（Google Places API）
- 距離順表示
- マップ＋リスト連動表示

### 業種指定検索

対象業種を指定して検索可能。営業ターゲットを絞った効率的なリスト作成ができます。

### websiteUri 解析による営業候補抽出

Google Places API の `websiteUri` を解析し、以下を自動判定：

- **未登録（none）**: ホームページ情報なし
- **SNSのみ（sns_only）**: Instagram、Facebook、Twitter、TikTok など
- **外部媒体のみ（external_media_only）**: 食べログ、ホットペッパー、Retty など
- **独自ホームページ（has_own_website）**: 独自ドメインのWEBサイト所有

### 営業ステータス管理（簡易CRM）

候補ごとに営業進捗を管理：

- **未対応**: 初期状態
- **営業済**: 営業活動実施済み
- **返信あり**: 見込み客から返信受取
- **対象外**: 営業対象でないと判定
- **保守契約**: 契約顧客

メモ機能で営業活動の詳細を記録可能。

### 認証

Convex Auth による Google OAuth のみ（シンプルで安全）。
トップページのマップ閲覧はログイン不要。検索ボタン押下時に認証チェックを行い、未ログインユーザーにはログインモーダルを表示。

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/website-leads-map.git
cd website-leads-map
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. Convex 開発環境の初期化

初回セットアップ時は以下を実行：

```bash
npx convex dev --until-success
```

このコマンドは：
- Convex プロジェクトを初期化
- Convex ダッシュボード（https://dashboard.convex.dev）へのログインを促す
- デプロイキーを自動保存
- スキーマ をデータベースに適用

### 4. 環境変数の設定

#### Convex ダッシュボード（サーバーサイド）

Convex ダッシュボード（https://dashboard.convex.dev）でプロジェクトを開き、Settings > Environment variables で以下を設定：

| 変数名 | 説明 | 取得方法 |
|---|---|---|
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com) > OAuth 2.0 認証情報 |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | 同上 |
| `GOOGLE_PLACES_API_KEY` | Google Places API（New）キー | Google Cloud Console > API と サービス > 認証情報 |

#### `.env.local`（クライアントサイド）

プロジェクトルートに `.env.local` ファイルを作成：

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_MAPS_API_KEY_HERE
```

### 5. Google Cloud Console の設定

1. [Google Cloud Console](https://console.cloud.google.com) でプロジェクトを作成
2. 以下の API を有効化：
   - Google Maps JavaScript API
   - Places API（New）
3. OAuth 2.0 認証情報を作成：
   - アプリケーションタイプ: ウェブアプリケーション
   - リダイレクト URI: `http://localhost:3000/auth/callback/google` (開発環境)
4. API キーを作成（Maps API と Places API 両方）

### 6. 起動方法

フロントエンドとバックエンドを並行実行：

```bash
npm run dev
```

このコマンドは：
- `convex dev` (バックエンド) を起動
- `next dev` (フロントエンド) を起動

開発サーバーが起動したら、ブラウザで `http://localhost:3000` にアクセス。

## 環境変数一覧

### Convex ダッシュボード設定（サーバーサイド）

| 変数 | 用途 | 必須 |
|---|---|---|
| `AUTH_GOOGLE_ID` | Google OAuth認証 - Client ID | Yes |
| `AUTH_GOOGLE_SECRET` | Google OAuth認証 - Client Secret | Yes |
| `GOOGLE_PLACES_API_KEY` | Google Places API（New）呼び出し | Yes |

### `.env.local` 設定（クライアントサイド）

| 変数 | 用途 | 必須 |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API | Yes |

## 技術スタック

| レイヤー | 技術 |
|---|---|
| **Frontend** | Next.js 15（React） |
| **Backend** | Convex |
| **認証** | Convex Auth（Google OAuth） |
| **Map** | Google Maps JavaScript API |
| **Places** | Places API（New） |
| **Hosting** | Vercel |
| **UI Components** | shadcn/ui |
| **Styling** | Tailwind CSS |

## ディレクトリ構成

```
website-leads-map/
├── app/                          # Next.js アプリケーション
│   ├── (splash)/
│   │   ├── page.tsx             # トップページ（マップ＋検索＋認証チェック）
│   │   └── layout.tsx           # トップページレイアウト
│   ├── product/
│   │   ├── page.tsx             # / へリダイレクト（後方互換）
│   │   └── layout.tsx           # プロダクト画面レイアウト
│   ├── signin/
│   │   └── page.tsx             # Google OAuth サインインページ
│   ├── layout.tsx               # ルートレイアウト
│   └── auth/                    # Convex Auth コールバック
│
├── components/                   # React コンポーネント
│   ├── MapPanel.tsx             # Google Maps 表示
│   ├── BusinessPanel.tsx        # 検索結果/リード一覧パネル
│   ├── BusinessCard.tsx         # 事業所カード
│   ├── SearchBar.tsx            # 検索入力UI
│   ├── LoginModal.tsx           # ログイン促進モーダル
│   ├── LeadStatusBadge.tsx      # CRMステータスバッジ
│   └── ...その他UI部品
│
├── convex/                       # Convex バックエンド
│   ├── schema.ts                # DB スキーマ定義
│   ├── auth.ts                  # Convex Auth 設定
│   ├── leads.ts                 # リード CRUD（query/mutation）
│   ├── places.ts                # Places API 検索（action）
│   ├── lib/
│   │   ├── placesApi.ts         # Google Places API ラッパー
│   │   └── domainAnalysis.ts    # websiteUri 解析ロジック
│   └── _generated/              # Convex 自動生成ファイル
│
├── public/                       # 静的ファイル
├── README.md                     # このファイル
└── package.json
```

## websiteUri 判定ロジック

`convex/lib/domainAnalysis.ts` で実装。以下のドメインを自動判定：

### SNS ドメイン（`sns_only` に分類）

- instagram.com
- facebook.com
- twitter.com, x.com
- tiktok.com
- youtube.com
- line.me

### 外部グルメ・予約メディア（`external_media_only` に分類）

- tabelog.com（食べログ）
- hotpepper.jp（ホットペッパー）
- gurunavi.com（ぐるなび）
- retty.me（Retty）
- jalan.net（じゃらん）
- rakuten.co.jp（楽天）
- minpaku.com（民泊）
- airbnb.com（Airbnb）

### 判定方法

1. `websiteUri` が null/undefined → `none`
2. URL ホスト名を抽出（`www.` プレフィックス除去）
3. SNS ドメイン リストとマッチング → `sns_only`
4. 外部メディア リストとマッチング → `external_media_only`
5. その他のドメイン → `has_own_website`

ドメイン マッチングは正確性を優先：
- `hostname === domain` または `hostname.endsWith("." + domain)`
- 誤検出を回避（`notinstagram.com` は `instagram.com` と認識しない）

## CRM ステータス

リード保存時に以下のステータスで管理：

| ステータス | 説明 | 用途 |
|---|---|---|
| **未対応** | 初期状態。未営業 | 新規追加リード |
| **営業済** | 営業活動実施済み | 連絡済み、提案済み |
| **返信あり** | 顧客から返信受取 | 見込み客化 |
| **対象外** | 営業対象でない判定 | 条件不合致など |
| **保守契約** | 既存顧客・契約済み | 継続管理 |

メモ機能で各リードに営業活動の詳細（接触日、返信内容など）を記録可能。

## v2 予定機能

以下は v2 でのリリース予定：

- **CSV 出力**: リード一覧をCSV形式で出力（フィルタ結果含）
- **Stripe 決済**: SaaS 化に向けた有料プラン機能
- **バルク保存**: 複数リードの一括保存
- **カスタム業種マスタ**: ユーザーが検索対象業種を定義可能
- **営業テンプレート**: メールテンプレートなど

## トラブルシューティング

### 位置情報が取得できない

ブラウザの設定でこのサイトへの位置情報の使用を許可してください。

### Google OAuth ログインに失敗

1. `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` が Convex ダッシュボードに正しく設定されているか確認
2. Google Cloud Console でリダイレクト URI が登録されているか確認
3. ブラウザの cookies を有効化

### 検索結果が表示されない

1. `GOOGLE_PLACES_API_KEY` が Convex ダッシュボードに設定されているか確認
2. Places API（New）が Google Cloud で有効化されているか確認
3. 検索キーワードを入力してからボタンをクリック（デフォルトでも検索可能）

## ライセンス

MIT

## サポート

質問や不具合報告は GitHub Issues でお願いします。
