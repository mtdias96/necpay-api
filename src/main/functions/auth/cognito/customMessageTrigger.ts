import ForgotPassword from '@infra/emails/templates/ForgotPassword';
import { render } from '@react-email/render';
import { CustomMessageTriggerEvent } from 'aws-lambda';

export async function handler(event: CustomMessageTriggerEvent) {
  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    const code = event.request.codeParameter;
    const email = event.request.userAttributes.email;

    const html = await render(ForgotPassword({ code, email }));

    event.response.emailSubject = '🍷 AdegaTech | Recupere sua conta!';
    event.response.emailMessage = html;
  }
  return event;
}
