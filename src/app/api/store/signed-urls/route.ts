import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { storeProducts } from '@/data/store';

/**
 * GET /api/store/signed-urls?productId=1
 *
 * Returns signed (temporary) download URLs for a product's files.
 * Checks in order:
 *   1. store_files table in Supabase (uploaded by admin)
 *   2. product.storagePaths (static config)
 *   3. product.fileUrls (local static files fallback)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = Number(searchParams.get('productId'));

    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId is required' }, { status: 400 });
    }

    const product = storeProducts.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucketName = 'store-files';

    if (supabaseUrl && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      // 1. Check for DB-stored files (uploaded by admin)
      const { data: dbFiles } = await supabase
        .from('store_files')
        .select('storage_path, file_name')
        .eq('product_id', productId)
        .order('created_at', { ascending: true });

      if (dbFiles && dbFiles.length > 0) {
        const files = await Promise.all(
          dbFiles.map(async (row) => {
            const { data, error } = await supabase.storage
              .from(bucketName)
              .createSignedUrl(row.storage_path, 60 * 10); // 10 minutes

            if (error || !data?.signedUrl) {
              console.warn(`Signed URL failed for ${row.storage_path}:`, error?.message);
              return null;
            }

            const displayName = row.file_name
              .replace(/\.pdf$/i, '')
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (c: string) => c.toUpperCase());

            return { name: displayName, url: data.signedUrl, path: row.storage_path };
          })
        );

        const valid = files.filter(Boolean);
        if (valid.length > 0) {
          return NextResponse.json({ success: true, files: valid, source: 'storage' });
        }
      }

      // 2. Check static storagePaths on the product
      if (product.storagePaths && product.storagePaths.length > 0) {
        const files = await Promise.all(
          product.storagePaths.map(async (storagePath) => {
            const fileName = storagePath.split('/').pop() || 'download.pdf';
            const displayName = fileName
              .replace(/\.pdf$/i, '')
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (c: string) => c.toUpperCase());

            const { data, error } = await supabase.storage
              .from(bucketName)
              .createSignedUrl(storagePath, 60 * 10); // 10 minutes

            if (error || !data?.signedUrl) return null;
            return { name: displayName, url: data.signedUrl, path: storagePath };
          })
        );

        const valid = files.filter(Boolean);
        if (valid.length > 0) {
          return NextResponse.json({ success: true, files: valid, source: 'storage' });
        }
      }
    }

    // 3. Fallback: local static file URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || 'http://localhost:3000';
    const localFiles = product.fileUrls.map((fileUrl) => {
      const fileName = fileUrl.split('/').pop() || 'download.pdf';
      const displayName = fileName
        .replace(/\.pdf$/i, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      return { name: displayName, url: `${baseUrl}${fileUrl}`, path: fileUrl };
    });

    return NextResponse.json({ success: true, files: localFiles, source: 'local' });

  } catch (error: any) {
    console.error('Signed URLs error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
