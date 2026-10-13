import Link from 'next/link';

const spikes = [{ href: '/s1', label: 'S1 Phaser 4 + Tiled + Next.js' }];

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
