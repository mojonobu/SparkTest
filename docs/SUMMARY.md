# プロジェクトサマリ

## プロジェクト概要
Spark（`@sparkjsdev/spark` v2.0.0-preview）を使った3D Gaussian Splatビューア。二条城のsplatデータを表示。

## SPZ変換（PLY → SPZ）
`convert.mjs` でPLY形式をSPZ形式に変換。

- **そのまま変換**: 63MB → 17.6MB（`transcodeSpz`デフォルト設定）
- **splat間引き + 圧縮で4MBまで削減を試行**（最終的には不採用）:
  - 各splatの重要度スコア `opacity × max_scale` を計算
  - スコア上位N個だけ残した新PLYを生成 → SPZ変換
  - 結果: 300,000 splats → 4.0MB（元の1,179,648から75%削減）
  - **不採用理由**: 見た目が劣化した

## Spark描画側の軽量化（試行 → 不採用）

SparkRendererのオプションで描画負荷を下げる試みを実施。

| オプション | 効果 |
|---|---|
| `enableLod` / `lodSplatCount` | LOD有効化、描画splat数を制限 |
| `lodSplatScale` / `lodRenderScale` | LODターゲット縮小、サブピクセルsplatスキップ |
| `maxStdDev` | Gaussian描画範囲の縮小 |
| `minAlpha` | 低透明度splatのスキップ |
| `minSortIntervalMs` | ソート頻度の制限（CPU負荷軽減） |
| `renderer.setPixelRatio` | レンダリング解像度の低下 |
| キャンバス半解像度 | 内部描画を50%にしCSSでフルスクリーン表示 |

**最も攻めた設定**: lodSplatCount=30,000、pixelRatio=0.5相当、lodRenderScale=12.0

**不採用理由**: リモートデスクトップ（Edge）ではGPUアクセラレーションが効かず、どの設定でもFPS改善が限定的だった。画質劣化に見合わないため、デフォルト設定に戻した。

### 試行した設定の段階

| 段階 | lodSplatCount | pixelRatio | lodRenderScale | 結果 |
|---|---|---|---|---|
| 1 | 500,000 | devicePixelRatio | 3.0 | まだ重い |
| 2 | 250,000 | 1.5上限 | 5.0 | まだ重い |
| 3 | 100,000 | 1.0 | 8.0 | まだ重い |
| 4 | 50,000 | 0.75 | 10.0 | まだ重い |
| 5 | 30,000 | 0.5相当（半解像度キャンバス） | 12.0 | リモートEdgeでFPS 1、改善せず |

→ すべて不採用、デフォルト設定に戻した

## リモートデスクトップでの描画について

### 問題
リモートデスクトップ（RDP）経由のEdgeでFPS 1しか出なかった。

### 原因
- RDPは画面をビットマップとして転送するため、リモート側のGPUを直接使えない
- WebGLがソフトウェアレンダリング（SwiftShader等）にフォールバックする
- Spark側の描画設定をいくら軽量化しても、GPU自体が使えないためボトルネックは解消しない

### 確認方法
- Edgeで `edge://gpu` を開き「WebGL」が hardware accelerated か software か確認する

### 対処法（今後の選択肢）
- **GPU付きクラウドインスタンス**（AWS G4/G5、Azure NV系）+ GPU対応リモートツール（NICE DCV、Parsec等）を使う
- **Chrome Remote Desktop** — RDPよりGPUパススルーに対応しやすい
- **直接ブラウザアクセス** — リモートデスクトップを介さずWebサーバーに直接アクセスすればクライアント側のGPUが使える

## 最終構成
- `splats/nijojo.spz`: 17.6MB（全1,179,648 splats維持）
- `SparkRenderer`: デフォルト設定（LOD等なし）
- カメラ: 左右パン（±4.0）+ 前後ドリー（-11〜0）の自動アニメーション

## ファイル構成
| ファイル | 用途 |
|---|---|
| `index.html` | ビューア本体 |
| `convert.mjs` | PLY→SPZ変換スクリプト |
| `splats/nijojo.spz` | splatデータ（git管理） |
| `splats/nijojo.ply` | 元データ（.gitignore） |
| `splats/nijojo.jpg` | サムネイル |
