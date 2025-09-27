import axios from "axios";

interface WebhookResponse {
  success: boolean;
  message: string;
}

interface WebhookData {
  name: string;
  email: string;
  link: string;
}

export const sendWebhook = async (data: WebhookData) => {
  try {
    const response: Axios.AxiosXHR<WebhookResponse> = await axios.post(
      "https://webhook.inovaml.shop/webhook/48d40c6a-be30-4ce0-88ad-8026fc300a46",
      {
        event: "user.registered",
        data,
      }
    );

    console.log("Webhook enviado:", response.status);
    return response.data;
  } catch (err: any) {
    if (err instanceof Error) {
      console.error("Erro ao enviar webhook:", err.message);
      //   throw new Error(`Erro ao enviar webhook: ${err.message}`);
    }
    // throw new Error("Erro inesperado ao enviar webhook");
  }
};
