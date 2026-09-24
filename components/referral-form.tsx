"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { RegulationModal, RulesContent, PrivacyContent } from "@/components/regulation-modal"

export function ReferralForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedRules, setAcceptedRules] = useState(false)
  const [hasViewedRules, setHasViewedRules] = useState(false)
  const [hasViewedPrivacy, setHasViewedPrivacy] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (!acceptedPrivacy || !acceptedRules) {
      toast({
        title: "Atenção",
        description: "Por favor, aceite as regras da campanha e a política de privacidade para continuar.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const data = {
        name: (document.getElementById("seu-nome") as HTMLInputElement).value,
        email: (document.getElementById("seu-email") as HTMLInputElement).value,
        mobile_phone: (document.getElementById("seu-telefone") as HTMLInputElement).value,
        nome_do_indicado: (document.getElementById("indicado-nome") as HTMLInputElement).value,
        telefone_do_indicado: (document.getElementById("indicado-telefone") as HTMLInputElement).value,
        email_do_indicado: (document.getElementById("indicado-email") as HTMLInputElement).value,
        cidade_do_indicado: (document.getElementById("indicado-cidade") as HTMLInputElement).value,
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Erro ao enviar indicação")

      toast({
        title: "Indicação enviada com sucesso!",
        description: "Obrigado por indicar a AX Mercado Real. Nossa equipe entrará em contato com o indicado em breve.",
      })

      form.reset()
      setAcceptedPrivacy(false)
      setAcceptedRules(false)
      setHasViewedRules(false)
      setHasViewedPrivacy(false)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro ao enviar sua indicação. Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "bg-[#1c1c1c]/50 border-[#d4d3ce]/10 text-[#d4d3ce] placeholder:text-[#d4d3ce]/20 focus:border-[#986f31] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg h-12 transition-all duration-300"

  return (
    <section id="formulario" className="py-20 md:py-32 bg-[#1c1c1c]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#d4d3ce] mb-6 tracking-tight">
            Faça Sua Indicação
          </h2>
          <p className="text-lg text-[#d4d3ce]/60 max-w-2xl mx-auto leading-relaxed font-light">
            Inicie o processo de indicação preenchendo os dados abaixo com segurança
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="p-8 md:p-16 rounded-[2.5rem] border border-[#d4d3ce]/5 bg-[#273849]/30 backdrop-blur-md shadow-2xl shadow-black/20">
            <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12">
              {/* Dados do Indicado */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 rounded-full bg-[#986f31]/10 flex items-center justify-center border border-[#986f31]/20">
                      <span className="text-[#986f31] font-bold">01</span>
                   </div>
                   <h3 className="text-xl font-semibold text-[#d4d3ce] tracking-tight">
                    Dados do Indicado
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="indicado-nome" className="text-[#d4d3ce]/70 text-sm font-medium ml-1">
                      Nome Completo do Indicado *
                    </Label>
                    <Input id="indicado-nome" placeholder="Ex: João Silva" required className={inputClass} />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="indicado-telefone" className="text-[#d4d3ce]/70 text-sm font-medium ml-1">
                      Telefone do Indicado *
                    </Label>
                    <Input id="indicado-telefone" type="tel" placeholder="(00) 00000-0000" required className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="indicado-email" className="text-[#d4d3ce]/70 text-sm font-medium ml-1">
                      E-mail do Indicado *
                    </Label>
                    <Input id="indicado-email" type="email" placeholder="email@exemplo.com" required className={inputClass} />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="indicado-cidade" className="text-[#d4d3ce]/70 text-sm font-medium ml-1">
                      Cidade de Interesse *
                    </Label>
                    <Input id="indicado-cidade" placeholder="Cidade" required className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Seus Dados */}
              <div className="space-y-8 pt-10 border-t border-[#d4d3ce]/5">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 rounded-full bg-[#986f31]/10 flex items-center justify-center border border-[#986f31]/20">
                      <span className="text-[#986f31] font-bold">02</span>
                   </div>
                   <h3 className="text-xl font-semibold text-[#d4d3ce] tracking-tight">
                    Seus Dados (Indicador)
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="seu-nome" className="text-[#d4d3ce]/70 text-sm font-medium ml-1">
                    Seu Nome Completo *
                  </Label>
                  <Input id="seu-nome" placeholder="Seu nome" required className={inputClass} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="seu-email" className="text-[#d4d3ce]/70 text-sm font-medium ml-1">
                      Seu E-mail *
                    </Label>
                    <Input id="seu-email" type="email" placeholder="seu@email.com" required className={inputClass} />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="seu-telefone" className="text-[#d4d3ce]/70 text-sm font-medium ml-1">
                      Seu Telefone *
                    </Label>
                    <Input id="seu-telefone" type="tel" placeholder="(00) 00000-0000" required className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Termos */}
              <div className="space-y-6 pt-10 border-t border-[#d4d3ce]/5">
                <div className="flex items-start gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="mt-1 flex-shrink-0">
                          <Checkbox
                            id="rules"
                            checked={acceptedRules}
                            onCheckedChange={(checked) => setAcceptedRules(checked as boolean)}
                            disabled={!hasViewedRules}
                            className="border-[#d4d3ce]/20 data-[state=checked]:bg-[#986f31] data-[state=checked]:border-[#986f31] h-5 w-5 rounded-md transition-all duration-300"
                          />
                        </span>
                      </TooltipTrigger>
                      {!hasViewedRules && (
                        <TooltipContent side="right" className="bg-[#986f31] text-[#d4d3ce] border-none font-semibold">
                          Clique em &ldquo;regras da campanha&rdquo; para ler antes de aceitar.
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <Label
                    htmlFor="rules"
                    className={`block text-sm leading-relaxed font-light text-[#d4d3ce]/60 cursor-pointer select-none ${!hasViewedRules && 'opacity-70'}`}
                  >
                    Declaro que li e concordo com todas as{" "}
                    <RegulationModal
                      title="Regras da Campanha"
                      pdfUrl="/docs/regulamento.pdf"
                      onOpenChange={(open) => open && setHasViewedRules(true)}
                      content={<RulesContent />}
                      trigger={
                        <span className="inline text-[#986f31] hover:text-[#986f31]/80 transition-colors cursor-pointer font-semibold underline-offset-4 decoration-[#986f31]/30 hover:decoration-[#986f31] underline">
                          regras da campanha
                        </span>
                      }
                    />{" "}
                    de indicações da AX Mercado Real.
                  </Label>
                </div>

                <div className="flex items-start gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="mt-1 flex-shrink-0">
                          <Checkbox
                            id="privacy"
                            checked={acceptedPrivacy}
                            onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                            disabled={!hasViewedPrivacy}
                            className="border-[#d4d3ce]/20 data-[state=checked]:bg-[#986f31] data-[state=checked]:border-[#986f31] h-5 w-5 rounded-md transition-all duration-300"
                          />
                        </span>
                      </TooltipTrigger>
                      {!hasViewedPrivacy && (
                        <TooltipContent side="right" className="bg-[#986f31] text-[#d4d3ce] border-none font-semibold">
                          Clique em &ldquo;Política de Privacidade&rdquo; para ler antes de aceitar.
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <Label
                    htmlFor="privacy"
                    className={`block text-sm leading-relaxed font-light text-[#d4d3ce]/60 cursor-pointer select-none ${!hasViewedPrivacy && 'opacity-70'}`}
                  >
                    Li e aceito a{" "}
                    <RegulationModal
                      title="Política de Privacidade"
                      onOpenChange={(open) => open && setHasViewedPrivacy(true)}
                      content={<PrivacyContent />}
                      trigger={
                        <span className="inline text-[#986f31] hover:text-[#986f31]/80 transition-colors cursor-pointer font-semibold underline-offset-4 decoration-[#986f31]/30 hover:decoration-[#986f31] underline">
                          Política de Privacidade
                        </span>
                      }
                    />{" "}
                    da AX Mercado Real.
                  </Label>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#986f31] hover:bg-[#7a5927] text-[#d4d3ce] py-6 text-lg font-bold cursor-pointer rounded-xl shadow-xl shadow-[#986f31]/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="group-hover:tracking-wider transition-all duration-300">
                    {loading ? "Enviando Indicação..." : "Garantir Minha Premiação"}
                  </span>
                </button>
                <p className="text-[10px] text-center text-[#d4d3ce]/30 mt-6 uppercase tracking-[0.2em]">
                  🔒 Seus dados e do indicado estão protegidos e não serão compartilhados com terceiros
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
