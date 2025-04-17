"use client";

import { useMemo, useState } from "react";
import { RgbaColor, RgbaColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { rgbaColorToString, rgbaStringToColor } from "@/lib/colors";

interface ColorPickerProps {
  value: RgbaColor;
  onChange: (value: RgbaColor) => void;
  onBlur?: () => void;
}

const white = { r: 255, g: 255, b: 255, a: 1 };

export default function ColorPicker({
  disabled,
  value,
  onChange,
  onBlur,
  name,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "value" | "onChange" | "onBlur"> &
  ColorPickerProps) {
  const [open, setOpen] = useState(false);

  const parsedValue = useMemo(() => {
    return rgbaColorToString(value) || "#FFFFFF";
  }, [value]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
        <Button
          {...props}
          className={cn("block", className)}
          name={name}
          onClick={() => {
            setOpen(true);
          }}
          size="icon"
          style={{
            backgroundColor: parsedValue,
          }}
          variant="outline"
        >
          <div />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <RgbaColorPicker color={value} onChange={onChange} />
        <Input
          maxLength={7}
          onChange={(e) => {
            onChange(rgbaStringToColor(e.currentTarget.value));
          }}
          value={parsedValue}
        />
      </PopoverContent>
    </Popover>
  );
}
