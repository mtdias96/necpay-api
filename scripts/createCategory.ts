/* eslint-disable no-console */

import fs from 'fs/promises';
import path from 'path';

// Configurações da API
const API_URL = 'https://gx3oqvvos3.execute-api.sa-east-1.amazonaws.com/category';

const TOKEN = 'eyJraWQiOiJpcWw4UVhNeGVIVERLRTVrZnR6dDZTNk5nempDRmZIczlZb0lQUmxYY1BvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxMzNjMWE3YS1hMDUxLTcwYTYtY2I4MS1mZTY0NWQ2MjkwMmMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV9kRlVjOFU5NmMiLCJzdG9yZUlkIjoiZTA1ODNlN2ItNTI1OC00NTRhLTlkOTQtYTE1OWE5MGZiYWRhIiwiY2xpZW50X2lkIjoiNjN1ZG90NHFiaGhzMDJkMmdraDZ2dDFiNnIiLCJvcmlnaW5fanRpIjoiYzVhZmVjZmEtZTViMS00YjIwLTliNWEtZTUwMjA5ZDI1Y2UwIiwiaW50ZXJuYWxJZCI6Ijc4NWNlZTM0LWU5MzctNGFlNS04NDViLWMxNjUwNjgxNDRkNyIsImV2ZW50X2lkIjoiN2Q1MzI2Y2YtZmM2My00NDkxLTkyZWYtMDdhNzgyNDJiODhkIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc1NjUyNDkyMiwiZXhwIjoxNzU2NTY4MTIyLCJpYXQiOjE3NTY1MjQ5MjIsImp0aSI6IjE0NzA2ZDBlLWExYTAtNDYxYi04M2QzLTVlYzliYTk4M2I0MCIsInVzZXJuYW1lIjoiMTMzYzFhN2EtYTA1MS03MGE2LWNiODEtZmU2NDVkNjI5MDJjIn0.EaCdATcs2uupRXVY_YHSmgaMbugQC1Lwx65vt8NUPGQJIKfX9SpXo1hz3rhQpDjWAIS7SImbiTGhDgWq9VoP52szIuy7sl1YTyWbvsqv3Fk3KzMzaF2PVKkDP5fy5BtUf5k6N2E0fa7loZ2eGzse3FJ3vfwvZlwBPMDIaEBJoXLSLYIHq8wVlbpAsOA57wI5Iemnp4mxKsXnWINA0gxR7SACT4busQTDmN2PjFsBEIGygnRbrTOy1_Pq9FoCmWHK7qylF4OhOFHjMbc6iZHjvornjAkBHKxrwTkUxJxZqJyfUy1WoysYovYQu2Iq7FiCZyFCxpdVdpUxOVGPrieXTQ';

interface ICategory {
  name: string;
  active?: boolean;
}

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

const categoryData: ICategory = {
  name: 'Cerveja Icon',
  //  active: true,
};

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

async function createCategory(
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
      name: categoryData.name,
      file: { type: fileType, size: fileSize },
    }),

  });

  console.log(res);

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
    const { url, fields } = await createCategory(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error('❌ Error during uploadMealImage:', err);
    throw err;
  }
}

uploadMealImage(
  path.resolve(__dirname, 'assets', 'cerveja.jpeg'),
).catch(() => process.exit(1));
