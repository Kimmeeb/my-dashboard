export default async function handler(req, res) {
  // CORS 허용
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { account_no } = req.body;

  // 1. 액세스 토큰 발급
  const tokenRes = await fetch('https://openapi.wooribank.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.WOORI_CLIENT_ID,
      client_secret: process.env.WOORI_CLIENT_SECRET,
    }),
  });
  const { access_token } = await tokenRes.json();

  // 2. 잔액 조회
  const balRes = await fetch(`https://openapi.wooribank.com/v1/inquiry/balance?account_no=${account_no}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const data = await balRes.json();

  res.status(200).json({ balance: data.balance_amt });
}