import { cn } from "../lib/utlis"; 
interface PencilSpinnerProps {
  className?: string;
}
const PencilSpinner = ({ className }: PencilSpinnerProps) => {
  return (
    <svg
      className={cn("block w-40 h-40", className)}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="pencil-eraser">
          <rect rx="5" ry="5" width="30" height="30" />
        </clipPath>
      </defs>
      <circle
        className="pencil__stroke"
        r="70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="439.82 439.82"
        strokeDashoffset="439.82"
        strokeLinecap="round"
        transform="rotate(-113,100,100)"
      />
      <g className="pencil__rotate" transform="translate(100,100)">
        <g fill="none">
          <circle
            className="pencil__body1"
            r="64"
            stroke="var(--primary)"
            strokeWidth="30"
            strokeDasharray="402.12 402.12"
            strokeDashoffset="402"
            transform="rotate(-90)"
          />
          <circle
            className="pencil__body2"
            r="74"
            stroke="var(--ring)"
            strokeWidth="10"
            strokeDasharray="464.96 464.96"
            strokeDashoffset="465"
            transform="rotate(-90)"
          />
          <circle
            className="pencil__body3"
            r="54"
            stroke="var(--accent)"
            strokeWidth="10"
            strokeDasharray="339.29 339.29"
            strokeDashoffset="339"
            transform="rotate(-90)"
          />
        </g>
        <g className="pencil__eraser" transform="rotate(-90) translate(49,0)">
          <g className="pencil__eraser-skew">
            <rect fill="var(--secondary)" rx="5" ry="5" width="30" height="30" />
            <rect fill="var(--ring)" width="5" height="30" clipPath="url(#pencil-eraser)" />
            <rect fill="var(--muted)" width="30" height="20" />
            <rect fill="var(--border)" width="15" height="20" />
            <rect fill="var(--muted-foreground)" width="5" height="20" />
            <rect fill="oklch(0.3 0.01 260 / 0.2)" y="6" width="30" height="2" />
            <rect fill="oklch(0.3 0.01 260 / 0.2)" y="13" width="30" height="2" />
          </g>
        </g>
        <g className="pencil__point" transform="rotate(-90) translate(49,-30)">
          <polygon fill="oklch(0.78 0.12 70)" points="15 0,30 30,0 30" />
          <polygon fill="oklch(0.68 0.14 55)" points="15 0,6 30,0 30" />
          <polygon fill="var(--foreground)" points="15 0,20 10,10 10" />
        </g>
      </g>
    </svg>
  );
};
export default PencilSpinner;