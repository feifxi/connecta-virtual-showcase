import Link from 'next/link';

const spikes = [
  { href: '/s1', label: 'S1 Phaser 4 + Tiled + Next.js' },
  { href: '/s3', label: 'S3 LiveKit: เสียง · กล้อง · แชร์จอ' },
];

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Connecta POC</h1>
      <ul>
        {spikes.map((s) => (
          <li key={s.href}>
            <Link href={s.href}>{s.label}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
