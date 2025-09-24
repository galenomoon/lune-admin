import {
  Controller,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
} from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes, useRef, useCallback } from "react";
import { withMask } from "use-mask-input";

export type FormInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
  mask?: string;
  maskOptions?: {
    placeholder?: string;
    showMaskOnHover?: boolean;
    [key: string]: unknown;
  };
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "name" | "defaultValue">;

export function FormInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  defaultValue,
  mask,
  maskOptions,
  ...inputProps
}: FormInputProps<TFieldValues, TName>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const maskRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (mask && input) {
        withMask(mask, maskOptions || {})(input);
      }
    },
    [mask, maskOptions]
  );

  return (
    <Controller<TFieldValues, TName>
      name={name}
      control={control}
      defaultValue={(defaultValue ?? "") as FieldPathValue<TFieldValues, TName>}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <div className="flex flex-col gap-1">
            <FormControl>
              <Input
                id={name}
                {...field}
                {...inputProps}
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  inputProps.onChange?.(e);
                }}
                ref={mask ? maskRef : inputRef}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </div>

        </FormItem>
      )}
    />
  );
}