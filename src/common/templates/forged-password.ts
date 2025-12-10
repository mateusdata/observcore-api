export const forgetPasswordTemplate = (name: string, code: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">          
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">ObservCore</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Recuperação de Senha</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Olá, ${name}</h2>
                            <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                Recebemos uma solicitação para redefinir sua senha. Use o código de verificação abaixo para prosseguir:
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; display: inline-block;">
                                            <p style="color: #ffffff; font-size: 40px; font-weight: 700; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${code}</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 20px; border-radius: 8px;">
                                        <p style="color: #742a2a; margin: 0; font-size: 14px; line-height: 1.6;">
                                            <strong>⏱️ Importante:</strong> Este código expira em 10 minutos por questões de segurança.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #718096; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                                Se você não solicitou esta alteração, pode ignorar este email com segurança. Sua senha permanecerá inalterada.
                            </p>
                            <p style="color: #718096; margin: 30px 0 0 0; font-size: 14px;">
                                Atenciosamente,<br>
                                <strong style="color: #2d3748;">Equipe ObservCore</strong>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="color: #a0aec0; font-size: 13px; margin: 0; line-height: 1.5;">
                                © ${new Date().getFullYear()} ObservCore. Todos os direitos reservados.<br>
                                Este é um email automático, por favor não responda.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
