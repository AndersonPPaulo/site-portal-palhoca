"use client";

import { useContext, useState } from "react";
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
  BadgeCheck,
} from "lucide-react";
import { PublicCompanyContext, IContactFormData } from "@/provider/company";

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
  companyMessage: z
    .string()
    .max(500, "Mensagem deve ter no máximo 500 caracteres")
    .optional(),
  cnpj: z
    .string()
    .min(1, "CNPJ é obrigatório")
    .regex(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX"
    ),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createNewLead } = useContext(PublicCompanyContext);

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

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    return numbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})\.(\d{3})(\d)/, ".$1.$2/$3")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await createNewLead(data);
      console.log("Lead enviado com sucesso!");
      console.log("Dados do formulário:", data);

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
    <section className="flex flex-col gap-4 max-w-[1272px] ">
      <div className="w-[150px] h-2  bg-primary rounded-full" />

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-primary">
          Anúncie sua marca no Portal Palhoça
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Faça parte do maior portal de notícias e comércios de Palhoça.
          Preencha o formulário abaixo e nossa equipe entrará em contato.
        </p>
      </div>

      {/* Formulário */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna do formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-1 border-gray-300">
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
            {/* CNPJ */}
            <div className="space-y-2">
              <Label
                htmlFor="cnpj"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <BadgeCheck size={17} className="text-primary" />
                CNPJ *
              </Label>
              <Input
                id="cnpj"
                type="cnpj"
                placeholder="00.000.000/0000-00"
                {...register("cnpj")}
                className={`w-full ${
                  errors.cnpj ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cnpj && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.cnpj.message}
                </p>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  className="text-primary"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Whatsapp *
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
                {...register("companyMessage")}
                className={`w-full resize-none ${
                  errors.companyMessage ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.companyMessage && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.companyMessage.message}
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
          <div className="bg-secondary rounded-xl p-6 border-1 border-green-100">
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
          <div className="bg-white rounded-xl shadow-lg p-6 border-1 border-gray-300">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Contato Direto
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 ">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  className="text-primary"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <div className="text-gray-600">
                  <span>(48) 99115-7845</span>
                </div>
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
