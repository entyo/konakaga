# konakaga

![konakaga-logo](./img/konakaga-catch.png)

## これはなに？

毎朝TWINSを見て、休講情報があると通知してくれるプログラムです。

![how-it-works](./img/how-it-works.png)

Heroku App として各自でデプロイして使ってください。

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## つかいかた

### 1. 連携サービスのアカウント作成

konakaga を使うためには、まず以下のサービスのアカウントを作成してください。

- [Heroku: Cloud Application Platform](https://www.heroku.com/)
  - konakaga をデプロイするために使います
- [SendGrid: Email Delivery Service](https://sendgrid.com/)
  - konakaga からメール通知をするために使います

また、以下の手順に従って、SendGridでkonakaga用のプロジェクトを作成しAPIキーを発行してください。

> 1. SendGridダッシュボードの「API Keys」のページでCreate API Keyを選択
> 2. Create & Viewを選択

([APIキーの管理 - ドキュメント | SendGrid](https://sendgrid.kke.co.jp/docs/User_Manual_JP/Settings/api_keys.html#-Create-an-API-Key)より)

### 2. アプリケーションのデプロイ

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

↑このボタンを押すと、Heroku上で次のような画面が表示されます

![作成画面](./img/create-heroku-app.png)

1の手順で発行したアカウントに関する情報を入力して、`Deploy App` をクリックしてください。

## 免責事項

- konakagaの不具合により休校情報を見逃しても開発者は一切責任を取りません
- konakaga はスクレイピングによって情報を収集しているので、ある日突然動かなくなることがありますが、その都度直すことは大変なので動作を保証しません
- konakagaの改変及び再配布を認めていますが、以下の点に注意してください
  - スクレイピングの頻度(短期間に大量のリクエストを発行しないでください)
  - 個人情報・認証情報の取り扱い
    - konakaga がプログラムを各自でデプロイする方式を取っているのは、TWINS のパスワード等の情報を運営者が管理しないようにするためです
