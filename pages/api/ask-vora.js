export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { message } = req.body
  const reply = `Echo: ${message}`

  res.status(200).json({ reply })
}