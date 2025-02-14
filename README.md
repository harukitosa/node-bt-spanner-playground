# Node.js + TypeScript 開発環境 with Bigtable & Spanner Emulators

このリポジトリは、Docker および docker-compose を利用して、Node.js + TypeScript のサーバー環境と Google Cloud の Bigtable Emulator および Spanner Emulator を組み合わせたローカル開発環境のサンプルです。

## 目次

- [前提条件](#前提条件)
- [環境構成](#環境構成)
- [セットアップ手順](#セットアップ手順)
- [プロジェクト構成](#プロジェクト構成)
- [サンプルコード](#サンプルコード)
- [起動方法](#起動方法)
- [クリーンアップ](#クリーンアップ)
- [備考](#備考)

## 前提条件

- [Docker](https://www.docker.com/) および [docker-compose](https://docs.docker.com/compose/) がインストールされていること
- Node.js のローカル環境 (Docker を利用せずに開発する場合)

## 環境構成

この開発環境は以下のサービスから構成されます。

- **server**: Node.js/TypeScript によるサーバー
- **bigtable**: Google Cloud SDK を利用した Bigtable Emulator  
  - コンテナ内部ポート: `8086`
  - ホスト側ポート: `18086` (他サービスと被らないように設定)
- **spanner**: Google Cloud SDK を利用した Spanner Emulator  
  - コンテナ内部ポート: `9010`
  - ホスト側ポート: `19010`

## セットアップ手順

1. **リポジトリのクローン**  
   プロジェクトのディレクトリにリポジトリをクローンしてください。

2. **Docker コンテナの起動**  
   プロジェクトルートに配置されている `docker-compose.yaml` を利用して、以下のコマンドで各コンテナを起動します。

   ```bash
   docker-compose up --build
   ```

   ※`--build` オプションで最新の Dockerfile に基づいたビルドを実施します。

3. **ローカルでの Node.js 実行 (オプション)**  
   Docker を使用せずにローカルで開発する場合は、以下の手順でセットアップしてください。

   - 依存パッケージのインストール

     ```bash
     npm install
     ```

   - TypeScript のビルド

     ```bash
     npm run build
     ```

   - サーバーの起動

     ```bash
     npm start
     ```

    または、開発時には `ts-node` を利用して直接実行できます。

    ```bash
    npm run dev
    ```

## プロジェクト構成

以下は、プロジェクトのディレクトリ構成例です。

```
.
├── Dockerfile              # Node.js/TypeScript サーバー用 Dockerfile
├── docker-compose.yaml     # Docker Compose 設定ファイル
├── package.json            # Node.js パッケージ設定とスクリプト
├── tsconfig.json           # TypeScript コンパイラ設定
└── src
    ├── index.ts            # サーバーのエントリーポイント
    ├── bigtableSample.ts   # Bigtable Emulator 接続サンプルコード
    └── spannerSample.ts    # Spanner Emulator 接続サンプルコード
```

## サンプルコード

### Bigtable 接続サンプル (`src/bigtableSample.ts`)

```typescript
import { Bigtable } from '@google-cloud/bigtable';

// docker-compose により設定された環境変数から接続先を取得
const bigtable = new Bigtable({
  apiEndpoint: process.env.BIGTABLE_EMULATOR_HOST, // 例: "bigtable:8086"
});

async function listInstances() {
  try {
    const [instances] = await bigtable.getInstances();
    console.log('Bigtable Instances:', instances);
  } catch (error) {
    console.error('Error listing Bigtable instances:', error);
  }
}

listInstances();
```

### Spanner 接続サンプル (`src/spannerSample.ts`)

```typescript
import { Spanner } from '@google-cloud/spanner';

// docker-compose により設定された環境変数から接続先を取得
const spanner = new Spanner({
  projectId: 'demo-project',  // エミュレータ用の任意のプロジェクトID
  apiEndpoint: process.env.SPANNER_EMULATOR_HOST, // 例: "spanner:9010"
});

async function listInstances() {
  try {
    const [instances] = await spanner.getInstances();
    console.log('Spanner Instances:', instances);
  } catch (error) {
    console.error('Error listing Spanner instances:', error);
  }
}

listInstances();
```

## 起動方法

### Docker Compose を利用する場合

1. プロジェクトルートで以下のコマンドを実行し、全サービスを起動します。

   ```bash
   docker-compose up --build
   ```

2. サーバーはコンテナ内部ではポート `3000` で稼働します。  
   ホスト側からアクセスする場合は `localhost:3000` になります。

3. Bigtable Emulator はホスト側 `localhost:18086`、Spanner Emulator は `localhost:19010` でアクセス可能です。

### ローカルで Node.js を利用する場合

1. 依存パッケージをインストールします。

   ```bash
   npm install
   ```

2. TypeScript コードをコンパイルします。

   ```bash
   npm run build
   ```

3. サーバーを起動します。

   ```bash
   npm start
   ```

または、開発時は以下で直接実行できます。

   ```bash
   npm run dev
   ```

## クリーンアップ

Docker コンテナを停止し、ネットワークや不要なリソースを削除する場合は、以下のコマンドを実行してください。

```bash
docker-compose down
```

## 備考

- **環境変数:**  
  サーバーコンテナ内では以下の環境変数が設定されています。  
  - `BIGTABLE_EMULATOR_HOST=bigtable:8086`  
  - `SPANNER_EMULATOR_HOST=spanner:9010`

- **ポート設定:**  
  内部通信では各コンテナのポート番号 (Bigtable: 8086, Spanner: 9010) を利用していますが、ホスト側のポートは他と被らないように調整しています。
  - Bigtable: ホスト `18086` → コンテナ `8086`
  - Spanner: ホスト `19010` → コンテナ `9010`
