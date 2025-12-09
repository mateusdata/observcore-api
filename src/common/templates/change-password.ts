export const changePasswordTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senha Alterada com Sucesso - ObservCore</title>
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
            <img src="https://www.valuehost.com.br/blog/wp-content/uploads/2023/03/post_thumbnail-6cc054b51851e25f51d703594838715e.jpeg.webp" alt="Logo ObservCore">
        </div>
        <div class="content">
            <h1>Olá, ${name}!</h1>
            <p>Sua senha foi alterada com sucesso.</p>
            <p>Se você não realizou essa alteração, por favor, entre em contato imediatamente com o suporte.</p>
            <p>Atenciosamente,<br>Equipe ObservCore</p>
        </div>
        <div class="footer">
            &copy; 2024 ObservCore. Todos os direitos reservados.
        </div>
    </div>
</body>
</html>
`
