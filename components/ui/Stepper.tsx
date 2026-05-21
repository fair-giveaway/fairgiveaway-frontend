import { FaMinus, FaPlus } from 'react-icons/fa6';

export default function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold text-textSecondary mb-2">{label}</label>}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border border-borderStrong bg-bgElevated text-textPrimary hover:bg-bgBase hover:border-accentPrimary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
          <FaMinus />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              onChange(Math.max(min, Math.min(max ?? Infinity, val)));
            }
          }}
          className="flex-1 w-0 h-10 rounded-lg border border-borderStrong bg-bgBase text-center text-base font-bold text-textPrimary outline-none focus:border-accentPrimary transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
        />
        <button
          onClick={() => onChange(Math.min(max ?? Infinity, value + 1))}
          disabled={max !== undefined && value >= max}
          className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border border-borderStrong bg-bgElevated text-textPrimary hover:bg-bgBase hover:border-accentPrimary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}
