export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { account_no } = req.body;

  // 1. 토큰 발급
  const tokenRes = await fetch('https://openapi.kbsec.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      appkey: process.env.KB_APP_KEY,
      appsecret: process.env.KB_APP_SECRET,
    }),
  });
  const { access_token } = await tokenRes.json();

  // 2. 잔고 조회 (kt00018)
  const holdRes = await fetch('https://openapi.kbsec.com/v1/kt00018', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ account_no }),
  });
  const data = await holdRes.json();

  res.status(200).json({
    total: data.tot_evlt_amt,
    cost: data.pchs_amt,
    holdings: data.holdings,
  });
}