export default function CinexaLogo({
  className = "h-7 w-auto",
  color = "#000000",
  title = "Cinexa",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 320"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <g id="wordmark" fill={color} fillRule="evenodd">
        <path
          id="C"
          d="M60 95 L210 75 L205 120 L125 130 L125 195 L205 195 L200 245 L75 255 L55 200 Z"
        />
        <path id="I" d="M255 75 L315 70 L305 250 L245 250 Z" />
        <path
          id="N"
          d="M340 250 L340 70 L400 70 L460 180 L460 70 L520 70 L520 250 L460 250 L400 140 L400 250 Z"
        />
        <path
          id="E"
          d="M550 70 L660 70 L655 110 L595 115 L595 140 L645 140 L640 175 L595 180 L595 210 L660 210 L655 250 L550 250 Z"
        />
        <path
          id="X"
          d="M695 75 L760 70 L800 145 L840 70 L905 75 L825 170 L905 255 L840 250 L800 195 L760 250 L695 245 L775 170 Z"
        />
        <path
          id="A"
          d="M940 250 L980 75 L1045 70 L1090 250 L1035 255 L1025 210 L995 210 L985 255 Z M1005 160 L1015 115 L1025 160 Z"
        />
      </g>
    </svg>
  );
}
