"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  User,
  Building2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Schema de validação com Zod
const contactFormSchema = z.object({
  companyName: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres")
    .max(100, "Nome da empresa deve ter no máximo 100 caracteres"),
  responsibleName: z
    .string()
    .min(2, "Nome do responsável deve ter pelo menos 2 caracteres")
    .max(50, "Nome do responsável deve ter no máximo 50 caracteres"),
  email: z
    .string()
    .email("Por favor, insira um email válido")
    .min(1, "Email é obrigatório"),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (XX) XXXXX-XXXX"
    )
    .min(1, "Telefone é obrigatório"),
  message: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(500, "Mensagem deve ter no máximo 500 caracteres")
    .optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  // Máscara para telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simular envio - aqui você integraria com sua API
      console.log("Dados do formulário:", data);

      // Simular delay de envio
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitStatus("success");
      reset();

      // Resetar status após 5 segundos
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 max-w-[1272px] mx-auto py-4">
      {/* Barra decorativa do portal */}
      <div className="w-[106px] h-2 bg-primary rounded-full" />

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-primary">
          Anúncie sua marca no Portal Palhoça
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Faça parte do maior portal de notícias e comércios de Palhoça.
          Preencha o formulário abaixo e nossa equipe entrará em contato.
        </p>
      </div>

      {/* Formulário */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna do formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome da Empresa */}
            <div className="space-y-2">
              <Label
                htmlFor="companyName"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Building2 size={16} className="text-primary" />
                Nome da Empresa *
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Ex: Restaurante do João"
                {...register("companyName")}
                className={`w-full ${
                  errors.companyName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Nome do Responsável */}
            <div className="space-y-2">
              <Label
                htmlFor="responsibleName"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <User size={16} className="text-primary" />
                Nome do Responsável *
              </Label>
              <Input
                id="responsibleName"
                type="text"
                placeholder="Seu nome completo"
                {...register("responsibleName")}
                className={`w-full ${
                  errors.responsibleName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.responsibleName && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.responsibleName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Mail size={16} className="text-primary" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                {...register("email")}
                className={`w-full ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Phone size={16} className="text-primary" />
                Telefone *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(48) 99999-9999"
                value={watch("phone") || ""}
                onChange={handlePhoneChange}
                className={`w-full ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={15}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Mensagem Opcional */}
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className="text-sm font-medium text-gray-700"
              >
                Mensagem (Opcional)
              </Label>
              <Textarea
                id="message"
                placeholder="Conte-nos mais sobre sua empresa e como podemos ajudar..."
                rows={4}
                {...register("message")}
                className={`w-full resize-none ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Botão de Envio */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </div>
              ) : (
                "Enviar Solicitação"
              )}
            </Button>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <p className="text-green-800 font-medium">
                    Solicitação enviada com sucesso!
                  </p>
                  <p className="text-green-600 text-sm">
                    Nossa equipe entrará em contato em breve.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <div>
                  <p className="text-red-800 font-medium">
                    Erro ao enviar solicitação
                  </p>
                  <p className="text-red-600 text-sm">
                    Tente novamente ou entre em contato conosco.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Coluna de informações */}
        <div className="space-y-6">
          {/* Card de benefícios */}
          <div className="bg-secondary rounded-xl p-6 border">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Por que anunciar conosco?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary rounded-full p-1 mt-1">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Maior Alcance</h4>
                  <p className="text-gray-600 text-sm">
                    Chegue a mais clientes em Palhoça e região
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary rounded-full p-1 mt-1">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Visibilidade Local
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Destaque sua empresa no portal mais acessado da cidade
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary rounded-full p-1 mt-1">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Suporte Personalizado
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Nossa equipe te ajuda a criar a melhor estratégia
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de contato direto */}
          <div className="bg-white rounded-xl shadow-lg p-6 border">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Contato Direto
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-primary" />
                <span>(48) 3333-4444</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-primary" />
                <span>comercial@portalpalhoca.com.br</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Ou preencha o formulário ao lado e entraremos em contato com você!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
