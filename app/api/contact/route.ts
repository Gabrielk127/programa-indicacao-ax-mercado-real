import { Resend } from "resend"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitize(value: string) {
  return value.trim().replace(/[<>]/g, "")
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const {
      name,
      email,
      mobile_phone,
      nome_do_indicado,
      telefone_do_indicado,
      email_do_indicado,
      cidade_do_indicado,
    } = data

    if (!name || !email || !mobile_phone || !nome_do_indicado || !telefone_do_indicado) {
      return new Response(
        JSON.stringify({
          error: "Campos obrigatórios ausentes: nome, e-mail e telefone do indicador, nome e telefone do indicado.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    if (!EMAIL_REGEX.test(email) || (email_do_indicado && !EMAIL_REGEX.test(email_do_indicado))) {
      return new Response(JSON.stringify({ error: "E-mail inválido." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const phoneDigits = String(mobile_phone).replace(/\D/g, "")
    const referredPhoneDigits = String(telefone_do_indicado).replace(/\D/g, "")
    const isValidPhone = (digits: string) => digits.length >= 10 && digits.length <= 11
    if (!isValidPhone(phoneDigits) || !isValidPhone(referredPhoneDigits)) {
      return new Response(JSON.stringify({ error: "Telefone inválido." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY não encontrado nas variáveis de ambiente")
      return new Response(JSON.stringify({ error: "Serviço de e-mail não configurado." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const safeName = sanitize(String(name))
    const safeEmail = sanitize(String(email))
    const safeReferredName = sanitize(String(nome_do_indicado))

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM ?? "AX Mercado Real <contato@armangniimoveis.com.br>",
      to: process.env.CONTACT_EMAIL_TO ?? "",
      replyTo: safeEmail,
      subject: `Nova indicação: ${safeReferredName} — indicado por ${safeName}`,
      html: `
        <h2>Nova indicação pelo site</h2>
        <p><strong>Origem:</strong> landing-page-ax-indica</p>
        <h3>Indicado</h3>
        <p><strong>Nome:</strong> ${safeReferredName}</p>
        <p><strong>Telefone:</strong> ${referredPhoneDigits}</p>
        ${email_do_indicado ? `<p><strong>E-mail:</strong> ${sanitize(String(email_do_indicado))}</p>` : ""}
        ${cidade_do_indicado ? `<p><strong>Cidade:</strong> ${sanitize(String(cidade_do_indicado))}</p>` : ""}
        <h3>Indicador</h3>
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>E-mail:</strong> ${safeEmail}</p>
        <p><strong>Telefone:</strong> ${phoneDigits}</p>
      `,
    })

    if (error) {
      console.error("Erro ao enviar e-mail via Resend:", error)
      return new Response(JSON.stringify({ error: "Erro ao enviar e-mail." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Integração RD Station desativada — mantida como referência caso queira reativar.
    // const rdToken = process.env.RD_STATION_TOKEN
    // if (rdToken) {
    //   await fetch(`https://api.rd.services/platform/conversions?api_key=${rdToken}`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       event_type: "CONVERSION",
    //       event_family: "CDP",
    //       payload: {
    //         conversion_identifier: "landing-page-ax-indica",
    //         name: safeName,
    //         email: safeEmail,
    //         mobile_phone: phoneDigits,
    //         cf_nome_do_indicado: nome_do_indicado,
    //         cf_telefone_do_indicado: telefone_do_indicado,
    //         cf_email_do_indicado: email_do_indicado,
    //         cf_cidade_do_indicado: cidade_do_indicado,
    //       },
    //     }),
    //   })
    // }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Erro interno do servidor:", error)
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
