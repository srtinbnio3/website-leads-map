# TODO

## Google API キーの分離

- クライアント用（HTTPリファラー制限）とサーバー用（IP制限またはなし）でAPIキーを分ける
- 現状、サーバーサイド（Convex）からのリクエストにはリファラーが含まれないため、HTTPリファラー制限があるとPlaces APIがブロックされる（403 `API_KEY_HTTP_REFERRER_BLOCKED`）
- 対応方針：
  - クライアント用キー（`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`）: HTTPリファラー制限
  - サーバー用キー（`GOOGLE_PLACES_API_KEY`）: IP制限またはなし
