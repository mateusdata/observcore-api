export const changePasswordTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senha Alterada com Sucesso</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">ObservCore</h1>
                            <p style="color: #e0f7ff; margin: 10px 0 0 0; font-size: 16px;">Segurança da Conta</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="background-color: #d4edda; border-radius: 50%; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center;">
                                            <span style="color: #155724; font-size: 48px;">✓</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; text-align: center;">Senha Alterada com Sucesso!</h2>
                            <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                                Olá, ${name}
                            </p>
                            <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                Sua senha foi alterada com sucesso. A partir de agora, utilize sua nova senha para acessar sua conta.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 20px; border-radius: 8px;">
                                        <p style="color: #742a2a; margin: 0; font-size: 14px; line-height: 1.6;">
                                            <strong>🔒 Atenção:</strong> Se você não realizou esta alteração, entre em contato com nosso suporte imediatamente.
                                        </p>
                                    </td>
                                </tr>
                            </table>
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
