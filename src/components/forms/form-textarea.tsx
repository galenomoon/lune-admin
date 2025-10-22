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
import { Textarea } from "@/components/ui/textarea";
import { TextareaHTMLAttributes } from "react";

export type FormTextareaProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "name" | "defaultValue">;

export function FormTextarea<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  defaultValue,
  ...textareaProps
}: FormTextareaProps<TFieldValues, TName>) {
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
              <Textarea
                id={name}
                {...field}
                {...textareaProps}
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  textareaProps.onChange?.(e);
                }}
              />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </div>
        </FormItem>
      )}
    />
  );
}

