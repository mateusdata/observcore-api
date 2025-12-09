export const forgetPasswordTemplate = (name: string, code: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">          
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - Observcore</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            line-height: 1.6;
        }
        .content h1 {
            color: #333333;
        }
        .content p {
            color: #666666;
        }
        .code-box {
            background-color: #f1f1f1;
            border: 1px dashed #28a745;
            color: #333333;
            font-size: 22px;
            font-weight: bold;
            padding: 16px;
            text-align: center;
            letter-spacing: 2px;
            margin: 24px 0;
            border-radius: 6px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.valuehost.com.br/blog/wp-content/uploads/2023/03/post_thumbnail-6cc054b51851e25f51d703594838715e.jpeg.webp" alt="Logo Observcore">
        </div>  
        <div class="content">
            <h1>Olá, ${name}!</h1>
            <p>Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para prosseguir com a redefinição:</p>
            <div class="code-box">${code}</div>
            <p>Se você não solicitou essa alteração, por favor, ignore este e-mail.</p>
            <p>Atenciosamente,<br>Equipe Observcore</p>
        </div>
        <div class="footer">
            &copy; 2024 Observcore. Todos os direitos reservados.
        </div>
    </div>
</body>
</html>
`