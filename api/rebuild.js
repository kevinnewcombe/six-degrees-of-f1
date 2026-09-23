export default async function handler(req, res) {
  const response = await fetch(process.env.DEPLOY_HOOK_URL, {
    method: "POST",
  });
  res.status(200).json({ triggered: response.ok });
}