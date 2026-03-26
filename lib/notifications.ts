type InquiryNotificationInput = {
  customerName: string
  email: string
  phone?: string | null
  vehicleLabel: string
  notes?: string | null
}

export async function sendInquiryNotifications(input: InquiryNotificationInput) {
  const results: string[] = []

  const emailWebhook = process.env.EMAIL_WEBHOOK_URL
  const whatsappWebhook = process.env.WHATSAPP_WEBHOOK_URL

  const payload = {
    type: 'inquiry_created',
    ...input,
  }

  if (emailWebhook) {
    await fetch(emailWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    results.push('email:webhook-sent')
  } else {
    results.push('email:not-configured')
  }

  if (whatsappWebhook) {
    await fetch(whatsappWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    results.push('whatsapp:webhook-sent')
  } else {
    results.push('whatsapp:not-configured')
  }

  return results
}
