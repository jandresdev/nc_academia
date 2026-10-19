import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const media = path.join(root, 'assets', 'media');
fs.mkdirSync(media, { recursive: true });
const assets = [
  ['ia-facil-para-todos','hf_20261019_024852_1770e89a-eba3-450f-88b0-389b48486c87.png'],
  ['marketing-total-con-ia','hf_20261019_024852_70b7eb3f-71d0-4cc7-8457-89804c392d2c.png'],
  ['diseno-creativo-con-ia','hf_20261019_024852_b54f653b-5b65-4a36-be85-744b03b5f5d0.png'],
  ['publicidad-digital-ads','hf_20261019_024908_b375b84c-752c-42f3-9837-080634e9afb8.png'],
  ['ia-para-administrativos','hf_20261019_024908_b3499381-6be3-4bd1-95c1-531a7680f6af.png'],
  ['automatizacion-y-agentes-ia','hf_20261019_024853_f6135cf7-52c4-4490-a305-a6808f852259.png'],
  ['ia-para-comerciales','hf_20261019_024908_b36ab7fb-87ea-41a8-bb18-e436f771478c.png'],
  ['ia-para-finanzas','hf_20261019_024923_4cae67c4-89fe-4210-96f3-14cb4fc8e9e0.png'],
  ['ia-para-gerentes','hf_20261019_025046_e4ff1648-3708-4797-9f15-c3628c533045.png'],
  ['ia-360-para-empresas','hf_20261019_024923_72e3ebdd-bab7-4062-8f98-52b181c1b639.png']
];
for (const [slug, name] of assets) {
  const target = path.join(media, `${slug}.png`);
  if (fs.existsSync(target)) continue;
  const url = `https://d8j0ntlcm91z4.cloudfront.net/user_3GXwtVOlSLZcrwASfvejsXV1KrR/${name}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
  fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()));
  console.log(`${slug}: ${fs.statSync(target).size} bytes`);
}
const videoTarget=path.join(media,'automatizacion-y-agentes-ia.mp4');
if (!fs.existsSync(videoTarget)) {
  const response=await fetch('https://d8j0ntlcm91z4.cloudfront.net/user_3GXwtVOlSLZcrwASfvejsXV1KrR/hf_20261019_024942_918991ef-1436-4088-8c6d-d3a2d6eba345.mp4');
  if (!response.ok) throw new Error(`video: HTTP ${response.status}`);
  fs.writeFileSync(videoTarget,Buffer.from(await response.arrayBuffer()));
  console.log(`video: ${fs.statSync(videoTarget).size} bytes`);
}
