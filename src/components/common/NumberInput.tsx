import React, { useRef, useEffect } from 'react';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  autoFocus = true,
  maxLength = 2,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(newValue);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      maxLength={maxLength}
      className="w-24 h-16 text-4xl font-bold text-center border-4 border-blue-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-100"
    />
  );
};
