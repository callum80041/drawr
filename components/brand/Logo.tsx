export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="20" cy="20" r="20" fill="#0B3D2E" />
      {/* Football panel lines */}
      <circle cx="20" cy="20" r="13" stroke="#C8F046" strokeWidth="1.5" fill="none" />
      <line x1="20" y1="7" x2="20" y2="33" stroke="#C8F046" strokeWidth="1.5" />
      <line x1="7" y1="20" x2="33" y2="20" stroke="#C8F046" strokeWidth="1.5" />
      <line x1="10.5" y1="10.5" x2="29.5" y2="29.5" stroke="#C8F046" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="29.5" y1="10.5" x2="10.5" y2="29.5" stroke="#C8F046" strokeWidth="1" strokeOpacity="0.6" />
      {/* Centre diamond dot */}
      <rect x="18.5" y="18.5" width="3" height="3" fill="#C8F046" transform="rotate(45 20 20)" />
    </svg>
  )
}
