import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { storeProducts } from '@/data/store';

/**
 * POST /api/store/request-file
 *
 * Records a file request, attaches the PDF to the user's email,
 * and includes a 10-minute expiring download link.
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || 'http://localhost:3000';
    const downloadPageUrl = `${baseUrl}/store/download/${product.id}`;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'davidiwuji1@gmail.com';

    // 4. Record the request in Supabase (best-effort)
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

    // 5. Try to get the PDF file from Supabase Storage
    let pdfBuffer: Buffer | null = null;
    let signedUrl: string | null = null;
    let fileName = 'download.pdf';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucketName = 'store-files';

    if (supabaseUrl && serviceRoleKey) {
      const adminSupabase = createAdminClient(supabaseUrl, serviceRoleKey);

      // Try DB-stored files first, then storagePaths
      const { data: dbFiles } = await adminSupabase
        .from('store_files')
        .select('storage_path, file_name')
        .eq('product_id', product.id)
        .order('created_at', { ascending: true });

      const paths: string[] = [];

      if (dbFiles && dbFiles.length > 0) {
        dbFiles.forEach(f => paths.push(f.storage_path));
        fileName = dbFiles[0].file_name || 'download.pdf';
      } else if (product.storagePaths && product.storagePaths.length > 0) {
        product.storagePaths.forEach(p => paths.push(p));
        fileName = product.storagePaths[0].split('/').pop() || 'download.pdf';
      }

      if (paths.length > 0) {
        // Generate signed URL (10 min) for the download link
        const { data: urlData } = await adminSupabase.storage
          .from(bucketName)
          .createSignedUrl(paths[0], 60 * 10);
        signedUrl = urlData?.signedUrl || null;

        // Download the actual file for attachment
        const { data: fileBlob, error: dlError } = await adminSupabase.storage
          .from(bucketName)
          .download(paths[0]);

        if (!dlError && fileBlob) {
          const arrayBuffer = await fileBlob.arrayBuffer();
          pdfBuffer = Buffer.from(arrayBuffer);
          console.log(`Downloaded ${fileName} (${(pdfBuffer.length / 1024 / 1024).toFixed(1)} MB)`);
        } else {
          console.warn('Could not download file for attachment:', dlError?.message);
        }
      }
    }

    // 6. Send email via Gmail SMTP
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
      });

      // Verify connection
      try {
        await transporter.verify();
        console.log('SMTP connection verified ✓');
      } catch (verifyError: any) {
        console.error('SMTP verification failed:', verifyError.message);
        return NextResponse.json({
          success: false,
          error: `SMTP connection failed: ${verifyError.message}. Check your Gmail App Password.`,
        }, { status: 500 });
      }

      // Build email content
      const emailHtml = `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 32px 0 16px;">
            <img src="${baseUrl}/Logo.png" alt="SproutHR" style="height: 48px;" />
          </div>
          <div style="border-top: 3px solid #22c55e; margin: 0 auto 24px; width: 80px;"></div>
          <h1 style="font-size: 22px; color: #111827; margin: 0 0 8px;">Your Download is Ready! 🎉</h1>
          <p style="color: #4B5563; line-height: 1.6; margin: 0 0 8px;">
            Thanks for your interest in <strong>${product.title}</strong>.
          </p>
          ${pdfBuffer
            ? `<p style="color: #4B5563; line-height: 1.6; margin: 0 0 24px;">
                The PDF file has been attached to this email.
              </p>`
            : `<p style="color: #4B5563; line-height: 1.6; margin: 0 0 24px;">
                Click the button below to access your files.
              </p>`
          }
          ${signedUrl
            ? `<div style="background: #F0FDF4; border-radius: 12px; padding: 20px; margin: 0 0 24px;">
                <p style="color: #166534; font-weight: 600; margin: 0 0 4px; font-size: 14px;">🔗 Direct Download Link</p>
                <p style="color: #166534; margin: 0 0 12px; font-size: 13px;">This link expires in 10 minutes.</p>
                <div style="text-align: center;">
                  <a href="${signedUrl}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #22c55e, #4ade80); color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
                    ⬇ Download ${fileName.replace(/\.pdf$/i, '')}
                  </a>
                </div>
              </div>`
            : `<div style="text-align: center; margin: 0 0 24px;">
                <a href="${downloadPageUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #22c55e, #4ade80); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                  Go to Download Page
                </a>
              </div>`
          }
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #E5E7EB;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            SproutHR — Helping talent grow. 🌱
          </p>
        </div>
      `;

      // 6a. Build attachments array
      const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
      if (pdfBuffer) {
        attachments.push({
          filename: fileName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        });
      }

      // 6b. Send to user
      await transporter.sendMail({
        from: `"SproutHR Store" <${smtpUser}>`,
        to: user.email,
        subject: `Your Download: ${product.title}`,
        html: emailHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      // 6c. Admin notification (no attachment)
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
              <tr><td style="padding: 8px 12px; background: #F0FDF4; font-weight: 600;">User ID</td><td style="padding: 8px 12px;">${user.id}</td></tr>
              <tr><td style="padding: 8px 12px; background: #F0FDF4; font-weight: 600;">Time</td><td style="padding: 8px 12px;">${new Date().toLocaleString()}</td></tr>
              <tr><td style="padding: 8px 12px; background: #F0FDF4; font-weight: 600;">Attached File</td><td style="padding: 8px 12px;">${pdfBuffer ? `${fileName} (${(pdfBuffer.length / 1024 / 1024).toFixed(1)} MB) ✓` : '❌ Not available'}</td></tr>
            </table>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #E5E7EB;" />
            <p style="color: #9CA3AF; font-size: 12px;">SproutHR Store Notification</p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: pdfBuffer
          ? `✅ PDF attached and sent to ${user.email}!`
          : signedUrl
            ? `✅ Download link (10 min) sent to ${user.email}!`
            : `✅ Download page link sent to ${user.email}!`,
        downloadPageUrl,
        signedUrl,
      });
    }

    // Fallback: no SMTP configured — return download page URL
    return NextResponse.json({
      success: true,
      message: `📥 SMTP not configured. Open the download page directly:`,
      downloadPageUrl,
      signedUrl,
    });

  } catch (error: any) {
    console.error('Store request error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
