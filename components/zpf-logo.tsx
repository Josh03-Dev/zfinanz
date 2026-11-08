interface ZPFLogoProps {
  size?: 'sm' | 'md'
  subtitle?: string
}

export function ZPFLogo({ size = 'md', subtitle = 'Private Portal' }: ZPFLogoProps) {
  const boxSize  = size === 'sm' ? 34 : 42
  const fontSize = size === 'sm' ? 12 : 15
  const nameSize = size === 'sm' ? 12 : 14

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: boxSize, height: boxSize,
        border: '1.5px solid var(--gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize, fontWeight: 500,
        color: 'var(--gold)', letterSpacing: 2, position: 'relative', flexShrink: 0,
      }}>
        ZPF
        <div style={{ position: 'absolute', inset: 3, border: '0.5px solid rgba(196,164,74,0.35)' }} />
      </div>
      <div style={{ lineHeight: 1.25 }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-display)', fontSize: nameSize, fontWeight: 400,
          color: 'var(--cream)', letterSpacing: '.05em',
        }}>
          Zürichberg
        </span>
        <span style={{
          display: 'block', fontSize: 9, color: 'var(--mist)',
          letterSpacing: '.3em', textTransform: 'uppercase', marginTop: 2,
        }}>
          {subtitle}
        </span>
      </div>
    </div>
  )
}
