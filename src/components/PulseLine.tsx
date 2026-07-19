import { useScrollReveal } from '../hooks/useScrollReveal'

interface PulseLineProps {
  className?: string
  strokeWidth?: number
}

// The recurring signature motif: an ECG/heartbeat trace that draws itself
// once it scrolls into view. pathLength={1} normalizes the path so the
// dash animation works without measuring actual SVG geometry in JS.
export function PulseLine({ className = '', strokeWidth = 3 }: PulseLineProps) {
  const { ref, visible } = useScrollReveal<SVGSVGElement>()

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 100"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0,50 L110,50 L140,50 L158,22 L176,78 L194,12 L212,62 L230,50 L400,50 L430,50 L448,22 L466,78 L484,12 L502,62 L520,50 L600,50"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: visible ? 0 : 1,
          transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </svg>
  )
}
