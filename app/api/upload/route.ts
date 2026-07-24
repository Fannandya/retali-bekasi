import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, R2_BUCKET, r2PublicUrl } from "@/lib/r2/client";
import { R2_CATEGORIES, extFromMime, type R2Category } from "@/lib/r2/categories";
import { assertAdmin } from "@/lib/auth/assert-admin";

export async function POST(req: NextRequest) {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const category = body?.category as string | undefined;
  const contentType = body?.contentType as string | undefined;
  const size = body?.size as number | undefined;

  const config = category ? R2_CATEGORIES[category as R2Category] : undefined;
  if (!config) {
    return NextResponse.json({ error: "Kategori tidak valid" }, { status: 400 });
  }
  if (!contentType || !(config.mimeTypes as readonly string[]).includes(contentType)) {
    return NextResponse.json({ error: "Tipe file tidak diizinkan" }, { status: 400 });
  }
  if (!size || size > config.maxSize) {
    return NextResponse.json({ error: `Ukuran file maksimal ${config.maxSize / 1024 / 1024}MB` }, { status: 400 });
  }

  const key = `${category}/${crypto.randomUUID()}.${extFromMime(contentType)}`;

  const uploadUrl = await getSignedUrl(
    getR2Client(),
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 300 }
  );

  return NextResponse.json({ uploadUrl, path: key, publicUrl: r2PublicUrl(key) });
}

export async function DELETE(req: NextRequest) {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const path = body?.path as string | undefined;

  if (!path || !/^[a-z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(path)) {
    return NextResponse.json({ error: "Path tidak valid" }, { status: 400 });
  }
  const category = path.split("/")[0];
  if (!(category in R2_CATEGORIES)) {
    return NextResponse.json({ error: "Kategori tidak valid" }, { status: 400 });
  }

  await getR2Client().send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: path }));

  return NextResponse.json({ success: true });
}
