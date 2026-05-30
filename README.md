# 副資材発注リスト管理ツール

(株)アズマ電気工事部向け 副資材発注リスト管理ツール。  
Vite + React + Tailwind CSS で構築し、Google Sheets API と連携して発注明細・予実データを管理します。

---

## 機能概要

| 機能 | 説明 |
|---|---|
| 案件一覧 | Google スプレッドシートの案件マスターを一覧表示 |
| 案件詳細 / 予実パネル | 売上・想定原価・実行原価・利益率をリアルタイム表示 |
| 発注リスト明細 | 日付順 / 取引先別で並び替え可能なテーブル |
| 納品書取込（OCR） | 画像をアップロードして明細を自動読取（本実装は別途 OCR API 接続が必要） |
| 着工予定リスト連動 | 実行原価（税抜小計）を着工予定リストの K 列に自動同期 |

---

## ローカル開発環境のセットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を開き、以下の値を入力します（詳細は `.env.example` のコメント参照）。

| 変数名 | 必須 | 説明 |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | ✅ | Google OAuth2 クライアントID |
| `VITE_GOOGLE_SPREADSHEET_ID` | ✅ | 対象スプレッドシートの ID |
| `VITE_GOOGLE_SHEETS_RANGE` | — | 案件マスターの読み込み範囲（デフォルト: `案件マスター!A2:J`） |
| `VITE_GOOGLE_ORDER_SHEET_NAME` | — | 発注リストのシート名（デフォルト: `発注リスト`） |
| `VITE_GOOGLE_PLAN_SHEET_NAME` | — | 着工予定リストのシート名（デフォルト: `着工予定リスト`） |

> **注意:** `VITE_GOOGLE_CLIENT_ID` / `VITE_GOOGLE_SPREADSHEET_ID` が未設定の場合、  
> サンプルデータ（`src/data/sampleData.js`）で動作します（開発・確認用）。

### 3. 開発サーバーの起動

```bash
npm run dev
# → http://localhost:5173 で起動
```

---

## Google Cloud Console の設定手順

### Step 1. プロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 上部のプロジェクト選択 → **「新しいプロジェクト」** → プロジェクト名を入力して作成

### Step 2. Google Sheets API を有効化

1. 左メニュー **「APIとサービス」→「ライブラリ」**
2. 「Google Sheets API」を検索 → **「有効にする」**

### Step 3. OAuth 同意画面の設定

1. **「APIとサービス」→「OAuth 同意画面」**
2. User Type: **「内部」**（組織内利用の場合）または「外部」
3. アプリ名・サポートメール・デベロッパーの連絡先を入力
4. スコープ: `https://www.googleapis.com/auth/spreadsheets` を追加

### Step 4. OAuth2 クライアントID の作成

1. **「APIとサービス」→「認証情報」→「認証情報を作成」→「OAuth クライアント ID」**
2. アプリケーションの種類: **「ウェブアプリケーション」**
3. 承認済みの JavaScript 生成元に追加:
   ```
   http://localhost:5173          （ローカル開発用）
   https://your-app.example.com   （本番環境の URL に置き換え）
   ```
4. 作成後に表示される **クライアントID** を `.env` の `VITE_GOOGLE_CLIENT_ID` に設定

### Step 5. スプレッドシートの準備

対象スプレッドシートに以下のシートを作成します。

#### 案件マスター（シート名は `.env` の `VITE_GOOGLE_SHEETS_RANGE` に合わせる）

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| 案件番号 | 案件名 | ステータス | 区分 | 施主 | 担当 | 着工日 | 完工日 | 売上(税抜) | 想定原価 |
| AZ-2024-001 | ○○ビル新築電気工事 | active | 新築 | 株式会社○○ | 田中 一郎 | 2024-04-01 | 2024-09-30 | 5000000 | 3500000 |

ステータスの有効値: `active`（施工中）/ `completed`（完了）/ `planning`（計画中）/ `on_hold`（保留）

#### 発注リスト

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 案件番号 | 伝票日付 | 取引先 | 品名 | 数量 | 単価(税抜) | 発注担当 |

#### 着工予定リスト

| A | … | K |
|---|---|---|
| 案件番号 | （他列は任意） | 実行原価(税抜) ← ツールが自動書込み |

---

## ビルドとデプロイ

### ビルド

```bash
npm run build
# dist/ ディレクトリに静的ファイルが生成されます
```

### デプロイ先の比較

| | Vercel | Firebase Hosting | GitHub Pages |
|---|---|---|---|
| 無料枠 | ✅ 十分 | ✅ 十分 | ✅（公開リポジトリのみ） |
| 設定の手軽さ | ◎ CLI 1コマンド | ○ CLI 数ステップ | △ ブランチ設定が必要 |
| SPA ルーティング | ✅ `vercel.json` 設定済み | ✅ `firebase.json` 設定済み | ⚠ 追加対応が必要 |
| カスタムドメイン | ✅ | ✅ | ✅ |
| 推奨度 | **◎ 最も簡単** | ○ Google 系で統一したい場合 | △ |

---

### A. Vercel（推奨・最も簡単）

`vercel.json` は設定済みです。以下のコマンドだけで完了します。

```bash
# 1. Vercel CLI をインストール
npm install -g vercel

# 2. ログイン（ブラウザが開く）
vercel login

# 3. デプロイ（初回は対話形式）
vercel
#  → Framework Preset: Vite
#  → Build Command:    npm run build   （そのままEnter）
#  → Output Directory: dist            （そのままEnter）

# 4. 本番デプロイ
vercel --prod
```

初回デプロイ後に表示される URL（例: `https://azuma-sub-materials-tool.vercel.app`）を  
Google Cloud Console の OAuth2 クライアントIDの「承認済みの JavaScript 生成元」に追加してください。

以降は `git push` するだけで自動デプロイされます（GitHub 連携時）。

---

### B. Firebase Hosting

`firebase.json` / `.firebaserc` は設定済みです。`.firebaserc` の `your-firebase-project-id` を実際のプロジェクトIDに書き換えてください。

```bash
# 1. Firebase CLI をインストール
npm install -g firebase-tools

# 2. ログイン
firebase login

# 3. .firebaserc のプロジェクトIDを書き換える
#    Firebase Console > プロジェクト設定 > プロジェクトID を確認
#    例: "default": "azuma-tool-12345"

# 4. ビルド & デプロイ
npm run build
firebase deploy
```

デプロイ後に表示される URL（例: `https://azuma-tool-12345.web.app`）を  
Google Cloud Console の OAuth2 クライアントIDの「承認済みの JavaScript 生成元」に追加してください。

---

### C. GitHub Pages（サブパスデプロイ）

```bash
# 1. .env に以下を追加（リポジトリ名に合わせて変更）
#    VITE_BASE_PATH=/azuma-sub-materials-tool/

# 2. gh-pages パッケージをインストール
npm install -D gh-pages

# 3. package.json の scripts に追加
#    "deploy": "npm run build && gh-pages -d dist"

# 4. デプロイ
npm run deploy
```

GitHub リポジトリの Settings → Pages → Source を `gh-pages` ブランチに設定してください。

---

### デプロイ後の共通作業（必須）

デプロイ先の URL が決まったら、以下を実施してください。

1. [Google Cloud Console](https://console.cloud.google.com/) を開く
2. **「APIとサービス」→「認証情報」** → 作成済みの OAuth2 クライアントIDを選択
3. **「承認済みの JavaScript 生成元」** に本番 URL を追加

```
# 追加例
https://azuma-sub-materials-tool.vercel.app
https://azuma-tool-12345.web.app
```

4. 保存（反映まで数分かかる場合があります）

---

## プロジェクト構成

```
src/
├── components/
│   ├── CatTag.jsx          # 区分タグ
│   ├── Donut.jsx           # ドーナツチャート（利益率）
│   ├── Icon.jsx            # SVG アイコン
│   ├── InvoiceUpload.jsx   # 納品書アップロードモーダル
│   ├── Money.jsx           # 金額フォーマット
│   ├── Pct.jsx             # パーセント表示
│   ├── ProjectDetail.jsx   # 案件詳細・発注リスト
│   ├── ProjectList.jsx     # 案件一覧
│   └── StatusBadge.jsx     # ステータスバッジ
├── data/
│   └── sampleData.js       # 開発用サンプルデータ
└── utils/
    ├── helpers.js           # 財務計算 + Sheets API 高レベル関数
    ├── ocrApi.js            # OCR 読取（プレースホルダー）
    └── sheetsApi.js         # Google Sheets API v4 fetch ラッパー
```

---

## 今後の実装予定

- [ ] OCR API 接続（Google Cloud Vision API または Azure Document Intelligence）
- [ ] 案件新規作成・編集フォーム
- [ ] 発注担当者の検索・フィルタ
- [ ] CSV エクスポート
- [ ] 取込済み明細の修正・削除
