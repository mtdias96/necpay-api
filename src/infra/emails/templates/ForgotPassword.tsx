
import { Body, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from '@react-email/components';
import { Container } from '@react-email/container';

import React from 'react';


interface IForgotPasswordProps {
  code: string;
  email: string
}
export default function ForgotPassword({ code, email }: IForgotPasswordProps) {
  return (
    <Html>
      <Head />
      <Preview>Seu código de recuperação de senha - {code}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://sdmntpreastus.oaiusercontent.com/files/00000000-3188-61f9-9504-7cdaa0ba5502/raw?se=2025-06-17T14%3A47%3A36Z&sp=r&sv=2024-08-04&sr=b&scid=f28d2805-4ae0-5ecb-9671-e3f89f644f14&skoid=b0fd38cc-3d33-418f-920e-4798de4acdd1&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-17T13%3A26%3A32Z&ske=2025-06-18T13%3A26%3A32Z&sks=b&skv=2024-08-04&sig=Ib5mXHijI1vReUt3Xst9889w0uf/EvXyjONJ06Lz0RQ%3D"
              width="120"
              height="120"
              alt="Adega Tech Logo"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>Recuperação de Senha</Heading>

            <Text style={text}>
              Olá! Recebemos uma solicitação para redefinir a senha da sua conta em <strong>Adega Tech</strong>.
            </Text>

            <Text style={text}>Use o código abaixo para criar uma nova senha:</Text>

            <Section style={codeContainer}>
              <Text style={codeText}>{code}</Text>
            </Section>

            <Text style={text}>
              Este código é válido por <strong>15 minutos</strong> e pode ser usado apenas uma vez.
            </Text>

            <Text style={text}>
              Se você não solicitou a recuperação de senha, pode ignorar este email com segurança. Sua senha permanecerá
              inalterada.
            </Text>

            <Hr style={hr} />

            <Section style={securitySection}>
              <Heading style={h2}>Dicas de Segurança</Heading>
              <Text style={smallText}>
                {"• Nunca compartilhe seu código de recuperação com outras pessoas"}
                <br />
                {"• Use uma senha forte com pelo menos 8 caracteres"}
                <br />
                {"• Combine letras maiúsculas, minúsculas, números e símbolos"}
              </Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Este email foi enviado para <strong>{email}</strong>
            </Text>
            <Text style={footerText}>© 2024 ADEGA TECH. Todos os direitos reservados.</Text>
            <Text style={footerText}>
              Precisa de ajuda? Entre em contato conosco em{" "}
              <Link href="mailto:suporte@adegatech.com" style={link}>
                suporte@adegatech.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

ForgotPassword.PreviewProps = {
  code: '4545545'
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
}

const header = {
  padding: "32px 24px",
  textAlign: "center" as const,
  backgroundColor: "#1a2332",
}

const logo = {
  margin: "0 auto",
}

const content = {
  padding: "32px 24px",
}

const h1 = {
  color: "#1a2332",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 24px",
  textAlign: "center" as const,
}

const h2 = {
  color: "#1a2332",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 16px",
}

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
}

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
}

const codeContainer = {
  backgroundColor: "#f3f4f6",
  border: "2px dashed #d1a441",
  borderRadius: "8px",
  margin: "24px 0",
  padding: "24px",
  textAlign: "center" as const,
}

const codeText = {
  color: "#1a2332",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "0",
  fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
  border: "none",
  borderTop: "1px solid #e5e7eb",
}

const securitySection = {
  backgroundColor: "#fef3cd",
  border: "1px solid #d1a441",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
}

const footer = {
  padding: "24px",
  textAlign: "center" as const,
  backgroundColor: "#f9fafb",
}

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0 0 8px",
}

const link = {
  color: "#d1a441",
  textDecoration: "underline",
}
