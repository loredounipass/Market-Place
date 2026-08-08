import { randomBytes } from 'crypto';

const CSRF_TOKEN_NAME = 'csrfToken';



// OBTIENE EL TOKEN CSRF DEL REQUEST
function getTokenFromRequest(req: any): string | undefined {
  return req.headers?.['x-csrf-token'] || req.body?._csrf || req.query?._csrf;
}



// GENERA UN TOKEN CSRF PARA LA SESIÓN
function generateToken(req: any) {
  const existing = req.session?.[CSRF_TOKEN_NAME];
  if (existing) {
    return existing;
  }

  const token = randomBytes(32).toString('hex');
  req.session ??= {};
  req.session[CSRF_TOKEN_NAME] = token;
  return token;
}



// MIDDLEWARE DE PROTECCIÓN CSRF SINCRONIZADA
function csrfSynchronisedProtection(req: any, res: any, next: any) {
  if (req.path.endsWith('/csrf-token')) {
    return next();
  }

  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const tokenFromRequest = getTokenFromRequest(req);
  const tokenFromSession = req.session?.[CSRF_TOKEN_NAME];

  if (!tokenFromSession || !tokenFromRequest || tokenFromRequest !== tokenFromSession) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  return next();
}

export { generateToken, csrfSynchronisedProtection };
