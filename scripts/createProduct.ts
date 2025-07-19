/* eslint-disable no-console */

import fs from 'fs/promises';
import path from 'path';

// Configurações da API
const API_URL = 'https://gx3oqvvos3.execute-api.sa-east-1.amazonaws.com/product';

const TOKEN = 'eyJraWQiOiJpcWw4UVhNeGVIVERLRTVrZnR6dDZTNk5nempDRmZIczlZb0lQUmxYY1BvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxMzNjMWE3YS1hMDUxLTcwYTYtY2I4MS1mZTY0NWQ2MjkwMmMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV9kRlVjOFU5NmMiLCJzdG9yZUlkIjoiZTA1ODNlN2ItNTI1OC00NTRhLTlkOTQtYTE1OWE5MGZiYWRhIiwiY2xpZW50X2lkIjoiNjN1ZG90NHFiaGhzMDJkMmdraDZ2dDFiNnIiLCJvcmlnaW5fanRpIjoiOGExNjE3NDQtOGIwNi00ZDBmLTlmYWEtNGU4NTQzNjFlZjNiIiwiaW50ZXJuYWxJZCI6Ijc4NWNlZTM0LWU5MzctNGFlNS04NDViLWMxNjUwNjgxNDRkNyIsImV2ZW50X2lkIjoiMTNjNjA1ODktNmI1Ny00NjczLWJiZTAtNGJjMDNlNDM1NDI4IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc1MjkwNjU4NiwiZXhwIjoxNzUyOTQ5Nzg2LCJpYXQiOjE3NTI5MDY1ODYsImp0aSI6ImQxOGE0MjhlLWUxMGItNDE0OS1hYWY3LTRiMmU1YzEzY2Q4ZiIsInVzZXJuYW1lIjoiMTMzYzFhN2EtYTA1MS03MGE2LWNiODEtZmU2NDVkNjI5MDJjIn0.oomHChsvcnjSfnG_S8eCEXORWAQM6qoThapImHKKgLdSrHBnfpwC67JoONpHqWuCyH_VM1LpGq74Ia69d3Niv1REQtd5f2zwayf29XrqdNAkq5wwLQ__pVLYpHR26A6VDdcBC6R3MJ6ue7sPBAToggk3yEykQQp_ze3T2-3nHZBqSgnsgFpYaFFN1RddYka1qjevuJNx5f9MP9IvVGWUSD7_t0vEf6l18jXeiUMFiYAfXEfSpfTEJJrKQscl6u0ZktLKz81aQ4jnOdiHGMW5PqVwszNEsdhBp7Tt7KgSMoLOPMzUmBDZWJ38IHoPl8u97LQf1AuD7x3c56xl8_YDqQ';

interface IProductData {
  categoryId: string;
  name: string;
  price: number;
  costPrice: number;
  stockAlert: number;
  currentStock: number;
  barcode: string;
  description: string;
}

// Dados da cerveja Heineken
const heinekenData: IProductData = {
  categoryId: '02281de4-5654-4ba8-a376-99712cfb09ec',
  name: 'Cerveja Heineken Lata 350ml',
  price: 4.99,
  costPrice: 3.50,
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
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      file: { type: fileType, size: fileSize },
      product: heinekenData,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignResponse;
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
  const blob = new Blob([fileData], { type: fileType });
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
