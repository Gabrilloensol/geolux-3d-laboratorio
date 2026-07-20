interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export function ProgressBar({ value, max, label = "Progreso" }: ProgressBarProps) {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="progress-block" aria-label={`${label}: ${percent}%`}>
      <div className="progress-heading">
        <span>{label}</span>
        <strong>
          {value}/{max}
        </strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
