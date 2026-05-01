\## Parameter Store



AWS環境では、以下の値をSystems Manager Parameter StoreのSecureStringで管理する。



| パラメータ名 | 内容 |

|---|---|

| /withpet/prod/DB\_PASSWORD | RDS PostgreSQLのパスワード |

| /withpet/prod/JWT\_SECRET | JWT署名用シークレット |

| /withpet/prod/SMTP\_PASSWORD | SMTPアプリパスワード |



EC2には `withpet-ec2-role` を付与し、Parameter Storeの読み取り権限を付与する。



EC2上では以下のスクリプトでParameter Storeから値を取得し、`.env` を生成する。



```bash

./scripts/load-env-from-ssm.sh

```



`.env` はGit管理対象に含めない。

