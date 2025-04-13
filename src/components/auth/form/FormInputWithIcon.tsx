
import React from "react";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface FormInputWithIconProps {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  rightIcon?: React.ElementType;
  onRightIconClick?: () => void;
}

const FormInputWithIcon: React.FC<FormInputWithIconProps> = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  rightIcon: RightIcon,
  onRightIconClick,
}) => {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3 h-4 w-4 text-white/50" />
      <Input
        type={type}
        placeholder={placeholder}
        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
        value={value}
        onChange={onChange}
        required={required}
      />
      {RightIcon && (
        <button
          type="button"
          className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
          onClick={onRightIconClick}
        >
          <RightIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default FormInputWithIcon;
