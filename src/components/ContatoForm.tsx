import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export type ContatoFormValues = {
  primeiro_nome: string;
  segundo_nome: string;
  sobrenome: string;
  data_nascimento: string;
  genero: string;
  email: string;
  telefone: string;
  observacao: string;
};

const schema = z.object({
  primeiro_nome: z.string().trim().min(1, "Obrigatório").max(80),
  segundo_nome: z.string().trim().max(80).optional(),
  sobrenome: z.string().trim().min(1, "Obrigatório").max(120),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  genero: z.enum(["feminino", "masculino", "neutro"]),
  email: z.string().trim().email("Email inválido").max(255).optional().or(z.literal("")),
  telefone: z.string().trim().max(40).optional(),
  observacao: z.string().trim().max(1000).optional(),
});

const empty: ContatoFormValues = {
  primeiro_nome: "",
  segundo_nome: "",
  sobrenome: "",
  data_nascimento: "",
  genero: "feminino",
  email: "",
  telefone: "",
  observacao: "",
};

export default function ContatoForm({
  id,
  initial,
  onSaved,
}: {
  id?: string;
  initial?: ContatoFormValues;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<ContatoFormValues>(initial ?? empty);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ContatoFormValues>(k: K, v: ContatoFormValues[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os campos");
      return;
    }
    setSaving(true);
    const payload = {
      primeiro_nome: parsed.data.primeiro_nome,
      segundo_nome: parsed.data.segundo_nome || null,
      sobrenome: parsed.data.sobrenome,
      data_nascimento: parsed.data.data_nascimento,
      genero: parsed.data.genero,
      email: parsed.data.email || null,
      telefone: parsed.data.telefone || null,
      observacao: parsed.data.observacao || null,
    };
    const { error } = id
      ? await supabase.from("contatos").update(payload).eq("id", id)
      : await supabase.from("contatos").insert(payload);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(id ? "Contato atualizado" : "Contato criado");
      onSaved();
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Primeiro nome *</Label>
            <Input value={values.primeiro_nome} onChange={(e) => set("primeiro_nome", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Segundo nome</Label>
            <Input value={values.segundo_nome} onChange={(e) => set("segundo_nome", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Sobrenome *</Label>
            <Input value={values.sobrenome} onChange={(e) => set("sobrenome", e.target.value)} required />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Data de nascimento *</Label>
            <Input type="date" value={values.data_nascimento} onChange={(e) => set("data_nascimento", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Gênero *</Label>
            <Select value={values.genero} onValueChange={(v) => set("genero", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="neutro">Neutro / Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={values.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={values.telefone} onChange={(e) => set("telefone", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Observações</Label>
          <Textarea rows={3} value={values.observacao} onChange={(e) => set("observacao", e.target.value)} />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar"}</Button>
        </div>
      </form>
    </Card>
  );
}
