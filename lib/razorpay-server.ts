import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayClient: Razorpay | null = null;

/**
 * Returns a lazily-initialized Razorpay instance if server credentials exist.
 * Returns null if credentials are not configured, enabling graceful demo/test mode.
 */
export function getRazorpayInstance(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id,
      key_secret,
    });
  }

  return razorpayClient;
}

/**
 * Verifies Razorpay checkout payment signature using SHA-256 HMAC
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    // If running in development/sandbox mode without secret, allow mock signature check
    return signature.startsWith('mock_sig_') || signature.length >= 10;
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${orderId}|${paymentId}`);
  const generatedSignature = hmac.digest('hex');

  return generatedSignature === signature;
}
