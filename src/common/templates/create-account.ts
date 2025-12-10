export const createAccountTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao ObservCore</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">ObservCore</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Monitoramento Inteligente</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Bem-vindo, ${name}!</h2>
                            <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                                É um prazer tê-lo conosco. Sua conta foi criada com sucesso e você já pode começar a monitorar seus serviços com toda a inteligência e eficiência que o ObservCore oferece.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px;">
                                        <p style="color: #2d3748; margin: 0; font-size: 15px; line-height: 1.6;">
                                            <strong style="color: #667eea;">Próximos passos:</strong><br>
                                            Configure suas primeiras métricas, adicione seus serviços e comece a receber alertas em tempo real.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #4a5568; line-height: 1.6; margin: 30px 0 0 0; font-size: 15px;">
                                Se precisar de ajuda, nossa equipe está sempre disponível para auxiliá-lo.
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
