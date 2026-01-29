export function internalSecretAuth(req) {
  const secret = req.headers["x-internal-secret"];
  if (secret && secret === process.env.INTERNAL_SERVER_SECRET) {
    return true;
  }
  return false;
}
