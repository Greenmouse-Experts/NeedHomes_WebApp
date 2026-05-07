import { InputNumberFormat } from "@react-input/number-format";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PriceInput({
  value,
  onChange,
  placeholder = "0.00",
  className,
}: PriceInputProps) {
  return (
    <label className={`input w-full flex items-center gap-2 ${className ?? ""}`}>
      <span className="text-base-content/50 font-medium">₦</span>
      <InputNumberFormat
        className="grow bg-transparent outline-none"
        locales="en-NG"
        format="decimal"
        maximumFractionDigits={2}
        groupDisplay
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function parsePriceInput(formatted: string): number {
  return parseFloat(formatted.replace(/,/g, "").trim()) || 0;
}
