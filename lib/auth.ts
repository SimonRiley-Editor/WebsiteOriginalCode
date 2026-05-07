import { SignJWT, jwtVerify } from 'jose';

// Get the secret from the environment or use a fallback for local development
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-local-dev-only-change-this-in-production';
  return new TextEncoder().encode(secret);
};

export async function signJwt(payload: { [key: string]: any }) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // 24 hours expiration
      .sign(getSecretKey());
      
    return token;
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw new Error('Could not sign token');
  }
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (error) {
    // If token is invalid, expired, etc., jwtVerify will throw an error
    return null;
  }
}
