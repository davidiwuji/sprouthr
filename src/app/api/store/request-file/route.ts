import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';
import { storeProducts } from '@/data/store';

/**
 * POST /api/store/request-file
 *
 * Records a file request, sends the download link to the user's email,
 * and notifies the admin.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check auth
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ success: false, error: 'You must be signed in to request a file' }, { status: 401 });
    }

    // 2. Parse request
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    // 3. Find product
    const product = storeProducts.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // 4. Build download page URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || 'http://localhost:3000';
    const downloadPageUrl = `${baseUrl}/store/download/${product.id}`;

    // 5. Record the request in Supabase (best-effort)
    try {
      await supabase.from('store_requests').upsert({
        user_id: user.id,
        user_email: user.email,
        product_id: product.id,
        product_title: product.title,
        requested_at: new Date().toISOString(),
      }, { onConflict: 'user_id,product_id' });
    } catch (err) {
      console.warn('Store request logging skipped:', err);
    }

    // 6. Send email via Gmail SMTP
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'davidiwuji1@gmail.com';

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      });

      // 6a. To the user
      await transporter.sendMail({
        from: `"SproutHR Store" <${smtpUser}>`,
        to: user.email,
        subject: `Your Download: ${product.title}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 32px 0 16px;">
              <img src="${baseUrl}/Logo.png" alt="SproutHR" style="height: 48px;" />
            </div>
            <div style="border-top: 3px solid #22c55e; margin: 0 auto 24px; width: 80px;"></div>
            <h1 style="font-size: 22px; color: #111827; margin: 0 0 8px;">Your Download is Ready! 🎉</h1>
            <p style="color: #4B5563; line-height: 1.6; margin: 0 0 24px;">
              Thanks for your interest in <strong>${product.title}</strong>. Click the button below to access your files.
            </p>
            <div style="text-align: center; margin: 0 0 24px;">
              <a href="${downloadPageUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #22c55e, #4ade80); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                Access Your Files
              </a>
            </div>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #E5E7EB;" />
            <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
              SproutHR — Helping talent grow. 🌱
            </p>
          </div>
        `,
      });

      // 6b. Admin notification
      await transporter.sendMail({
        from: `"SproutHR Store" <${smtpUser}>`,
        to: adminEmail,
        subject: `📦 Store File Requested: ${product.title}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 20px; color: #111827;">📦 New Store File Request</h1>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 8px 12px; background: #F0FDF4; font-weight: 600;">Product</td><td style="padding: 8px 12px;">${product.title}</td></tr>
              <tr><td style="padding: 8px 12px; background: #F0FDF4; font-weight: 600;">User</td><td style="padding: 8px 12px;">${user.email}</td></tr>
              <tr><td style="padding: 8px 12px; background: #F0FDF4; font-weight: 600;">Time</td><td style="padding: 8px 12px;">${new Date().toLocaleString()}</td></tr>
            </table>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #E5E7EB;" />
            <p style="color: #9CA3AF; font-size: 12px;">SproutHR Store Notification</p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: `✅ File sent to ${user.email} — check your inbox!`,
      });
    }

    // Fallback: no SMTP configured — return download page URL
    return NextResponse.json({
      success: true,
      message: `📥 Access your files here:`,
      downloadPageUrl,
    });

  } catch (error: any) {
    console.error('Store request error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
