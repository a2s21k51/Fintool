import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tier,
      cycle,
      isMock,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { success: false, error: 'Missing payment identifiers' },
        { status: 400 }
      );
    }

    // Handle mock sandbox verification
    if (isMock) {
      return NextResponse.json({
        success: true,
        verified: true,
        tier,
        cycle,
        paymentId: razorpay_payment_id,
        message: 'Sandbox transaction verified successfully',
      });
    }

    // Verify cryptographic signature from Razorpay
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature || ''
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid Razorpay signature. Verification failed.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      tier,
      cycle,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: 'Razorpay payment verified successfully',
    });
  } catch (error) {
    console.error('API Error in /api/razorpay/verify:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
