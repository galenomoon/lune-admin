import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MetricSchema } from "../schemas/metric-schema";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarIcon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Repeat2, 
  MousePointer, 
  Eye,
  Type,
  Calendar as CalendarIconAlt,
  Clock,
  Image,
  Video
} from "lucide-react";

// Componente auxiliar para labels com ícones
const LabelWithIcon = ({ icon: Icon, children, className }: { 
  icon: React.ComponentType<{ className?: string }>, 
  children: React.ReactNode, 
  className?: string 
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Icon className="h-4 w-4" aria-hidden="true" />
    <span>{children}</span>
  </div>
);

export default function MetricForm({
  form,
  onSubmit,
  isLoading,
  onDelete,
  onDeleteLoading,
}: {
  form: UseFormReturn<MetricSchema>;
  onSubmit: (data: MetricSchema) => void;
  isLoading: boolean;
  onDelete?: () => void;
  onDeleteLoading?: boolean;
}) {
  const watchedFormat = form.watch("format");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <section>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LabelWithIcon icon={Video}>Formato</LabelWithIcon>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="reels">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" aria-hidden="true" />
                          Reels
                        </div>
                      </SelectItem>
                      <SelectItem value="carousel">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <Image className="h-4 w-4" aria-hidden="true" />
                          Carrossel
                        </div>
                      </SelectItem>
                      <SelectItem value="static-photo">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <Image className="h-4 w-4" aria-hidden="true" />
                          Foto Estática
                        </div>
                      </SelectItem>
                      <SelectItem value="live">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" aria-hidden="true" />
                          Live
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {watchedFormat === "carousel" && (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithIcon icon={Image}>Quantidade de Fotos</LabelWithIcon>
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="number"
                        placeholder="Ex: 5"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {(watchedFormat === "reels" || watchedFormat === "live") && (
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithIcon icon={Clock}>Duração (segundos)</LabelWithIcon>
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="number"
                        placeholder="Ex: 30"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithIcon icon={Type}>Título ou Descrição</LabelWithIcon>
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="Digite o título ou descrição"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="postDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    <LabelWithIcon icon={CalendarIconAlt}>Data de Postagem</LabelWithIcon>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reach"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LabelWithIcon icon={Eye}>Alcance</LabelWithIcon>
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      placeholder="Ex: 1500"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="saves"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LabelWithIcon icon={Bookmark}>Salvamentos</LabelWithIcon>
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      placeholder="Ex: 45"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LabelWithIcon icon={Share2}>Compartilhamentos</LabelWithIcon>
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      placeholder="Ex: 23"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="likes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LabelWithIcon icon={Heart}>Likes</LabelWithIcon>
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      placeholder="Ex: 120"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LabelWithIcon icon={MessageCircle}>Comentários</LabelWithIcon>
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      placeholder="Ex: 18"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reposts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LabelWithIcon icon={Repeat2}>Reposts</LabelWithIcon>
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      placeholder="Ex: 5"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkClicks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <LabelWithIcon icon={MousePointer}>Cliques no Link</LabelWithIcon>
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      placeholder="Ex: 12"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>
        <div className="flex w-full justify-end mt-6 gap-2">
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              className="px-12"
              disabled={onDeleteLoading}
              onClick={onDelete}
            >
              {onDeleteLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Deletar"
              )}
            </Button>
          )}
          <Button type="submit" className="px-12" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
