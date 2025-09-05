/* eslint-disable no-console */

import fs from 'fs/promises';
import path from 'path';

// Configurações da API
const API_URL = 'https://gx3oqvvos3.execute-api.sa-east-1.amazonaws.com/product';

const TOKEN = 'eyJraWQiOiJpcWw4UVhNeGVIVERLRTVrZnR6dDZTNk5nempDRmZIczlZb0lQUmxYY1BvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxMzNjMWE3YS1hMDUxLTcwYTYtY2I4MS1mZTY0NWQ2MjkwMmMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV9kRlVjOFU5NmMiLCJzdG9yZUlkIjoiZTA1ODNlN2ItNTI1OC00NTRhLTlkOTQtYTE1OWE5MGZiYWRhIiwiY2xpZW50X2lkIjoiNjN1ZG90NHFiaGhzMDJkMmdraDZ2dDFiNnIiLCJvcmlnaW5fanRpIjoiZmNiNTU5YzktNWI3ZC00MmU5LThjMmMtNTMxNTM0NmI4NDhkIiwiaW50ZXJuYWxJZCI6Ijc4NWNlZTM0LWU5MzctNGFlNS04NDViLWMxNjUwNjgxNDRkNyIsImV2ZW50X2lkIjoiMTUwNzZmMmMtM2Y3MC00OTFkLThkMzUtN2M3YjllNTI1ZDE0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc1NzA5Mzg2OCwiZXhwIjoxNzU3MTM3MDY4LCJpYXQiOjE3NTcwOTM4NjgsImp0aSI6Ijk2NTBhYTg1LWFiMTItNGQ4Ny05NzJlLTNmMTNlYzg4NDQzNCIsInVzZXJuYW1lIjoiMTMzYzFhN2EtYTA1MS03MGE2LWNiODEtZmU2NDVkNjI5MDJjIn0.MNMRuGIScNhMwwdzxGqtlhILBECcUrOLu5YrZ9yCkD1PPXx8NY9xbuA_3Ur5099GueLw8uq9D3MwXPHZY0BVQNf41moEJFBOL0LAuhJslrzWixeyKSs96TkRwnvMIzWkk_hSAg_iKyiQfVI0M_2JNd2PqKudvEqDDLqo3Zr1mHr7AWyIX80ic3QmdJQH0X96OIzvYUJKs8rVORIosRVV0kkfw5schBIIcq4L4LK9rjGPj5LILEa1tCQTU2IKV1GRzkIi9dNJpn57D-QIffhYzGYU-JMzeJ-iYmI1jTmungDUAwVo05IBP6J2WHKkN2iphhqZdSGtdq2ycds0jO8fjQ';

interface IProductData {
  categoryId: string;
  name: string;
  price: string;
  costPrice: string;
  stockAlert: number;
  currentStock: number;
  barcode: string;
  description: string;
}

// Dados da cerveja Heineken
const heinekenData: IProductData = {
  categoryId: 'dc8f7606-ac1e-4541-9822-b29f9cecdf05',
  name: 'TESTE DE UPLOAD FEITO PELO SCRIPT 2',
  price: '4.99',
  costPrice: '3.50',
  stockAlert: 10,
  currentStock: 50,
  barcode: `${(Math.random() * 100).toString()}`,
  description: '',
};

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readImageFile(filePath: string): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type: 'image/jpeg',
  };
}

async function createProduct(
  fileType: string,
  fileSize: number,
): Promise<IPresignDecoded> {
  console.log(`🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
  const res = await fetch(`${API_URL}/${'64e683e7-f2d2-428f-9ed5-5b1485e68903'}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      productUpdate: heinekenData,
      fileUpdate: { type: fileType, size: fileSize },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignResponse;
  console.log('🔍 API Response:', JSON.stringify(json, null, 2));

  if (!json.uploadSignature) {
    throw new Error('API response missing uploadSignature field');
  }

  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
  ) as IPresignDecoded;

  console.log('✅ Received presigned POST data');
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  const blob = new Blob([new Uint8Array(fileData)], { type: fileType });
  form.append('file', blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText} — ${text}`);
  }

  console.log('🎉 Upload completed successfully');
}

async function uploadMealImage(filePath: string): Promise<void> {
  try {
    console.log({ filePath });
    const { data, size, type } = await readImageFile(filePath);
    const { url, fields } = await createProduct(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error('❌ Error during uploadMealImage:', err);
    throw err;
  }
}

uploadMealImage(
  path.resolve(__dirname, 'assets', 'cover.jpeg'),
).catch(() => process.exit(1));
