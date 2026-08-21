import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayInstance } from '@/lib/razorpay-server';

// Server-side pricing source of truth (in INR)
const PLAN_PRICES: Record<string, { monthly: number; yearly: number; name: string }> = {
  pro: {
    monthly: 199,
    yearly: 1499,
    name: 'FinTools Pro',
  },
  business: {
    monthly: 499,
    yearly: 3999,
    name: 'CA & Business Pro',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier, cycle, userName, userEmail, userPhone } = body;

    if (!tier || !cycle || !PLAN_PRICES[tier]) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan or billing cycle selected' },
        { status: 400 }
      );
    }

    const planInfo = PLAN_PRICES[tier];
    const amountINR = cycle === 'yearly' ? planInfo.yearly : planInfo.monthly;
    const amountInPaise = amountINR * 100; // Razorpay takes amount in smallest currency sub-unit (paise)

    const receiptId = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const razorpay = getRazorpayInstance();
    const keyId = process.env.RAZORPAY_KEY_ID;

    // If Razorpay API credentials are configured on the server:
    if (razorpay && keyId) {
      try {
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            planTier: tier,
            planName: planInfo.name,
            billingCycle: cycle,
            customerName: userName || 'FinTools User',
            customerEmail: userEmail || 'user@fintools.in',
          },
        });

        return NextResponse.json({
          success: true,
          keyId: keyId,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          planName: planInfo.name,
          amountINR,
          isMock: false,
        });
      } catch (razorpayError: unknown) {
        console.error('Razorpay SDK order creation failed:', razorpayError);
        // Fallback to simulated test order if live key rejected or network issue
        return NextResponse.json({
          success: true,
          keyId: keyId || 'rzp_test_demo',
          orderId: `order_mock_${Date.now()}`,
          amount: amountInPaise,
          currency: 'INR',
          planName: planInfo.name,
          amountINR,
          isMock: true,
          notice: 'Operating in Sandbox Simulator mode',
        });
      }
    }

    // Graceful fallback for sandbox/preview if environment keys are not configured yet:
    return NextResponse.json({
      success: true,
      keyId: 'rzp_test_preview_sandbox',
      orderId: `order_mock_${Date.now()}`,
      amount: amountInPaise,
      currency: 'INR',
      planName: planInfo.name,
      amountINR,
      isMock: true,
      notice: 'Razorpay keys not yet configured in environment. Using Sandbox Simulator.',
    });
  } catch (error) {
    console.error('API Error in /api/razorpay/order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate Razorpay order' },
      { status: 500 }
    );
  }
}
