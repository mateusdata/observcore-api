import { Injectable, Logger, NotFoundException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { EmailsService } from "../emails/emails.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { PrismaService } from "src/common/prisma/prisma.service";
import { forgetPasswordTemplate } from "src/common/templates/forged-password";
import { changePasswordTemplate } from "src/common/templates/change-password";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly SALT_ROUNDS = 10;
    private readonly CODE_EXPIRY_MINUTES = 10;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailsService
    ) { }

    async create(createAuthDto: CreateAuthDto) {
        const normalizedEmail = createAuthDto.email?.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
            omit: { password: false }
        });

        if (!user) throw new NotFoundException('User not found');

        const isPasswordValid = await bcrypt.compare(createAuthDto.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException("User or password invalid");

        const payload = { sub: user.id, email: user.email };
        const { password, ...userWithoutPassword } = user;
        const token = this.jwtService.sign(payload);
        const expiresIn = this.jwtService.decode(token, { complete: true })?.payload?.exp;

        return { ...userWithoutPassword, token, expiresIn };
    }

    async refreshToken(refreshToken: string) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
            if (!user) throw new NotFoundException();

            const payload = { sub: user.id, email: user.email };
            return { token: this.jwtService.sign(payload) };
        } catch (error) {
            this.logger.error('Error refreshing token', error);
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async sendEmailCode(email: string) {
        const normalizedEmail = email?.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) throw new NotFoundException("User not found");

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000);

        await this.prisma.user.update({
            where: { email },
            data: { verificationCode: code, verificationExpiry: expiry },
        });

        const emailResult = await this.emailService.create({
            to: user.email,
            subject: "Código para alteração de senha - ObservCore",
            text: `Seu código para alteração de senha é: ${code}. O código expira em ${this.CODE_EXPIRY_MINUTES} minutos.`,
            body: forgetPasswordTemplate(user.name || 'Usuário', code),
        });

        return { message: "Código enviado com sucesso", email: user.email };
    }

    async validateCode(email: string, code: string) {
        const normalizedEmail = email?.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) throw new NotFoundException("User not found");

        if (!user.verificationCode || !user.verificationExpiry)
            throw new BadRequestException("Nenhum código de verificação encontrado. Solicite um código novamente.");

        const now = new Date();
        if (user.verificationCode !== code) throw new UnauthorizedException("Código inválido");
        if (user.verificationExpiry < now) throw new BadRequestException("Código expirado. Solicite um novo código.");

        return { message: "Código validado com sucesso" };
    }

    async changePassword(email: string, dto: ChangePasswordDto) {
        const normalizedEmail = email?.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) throw new NotFoundException("User not found");

        await this.validateCode(normalizedEmail, dto.code);

        const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

        await this.prisma.user.update({
            where: { email: normalizedEmail },
            data: { 
                password: hashedPassword, 
                verificationCode: null, 
                verificationExpiry: null 
            },
        });

        await this.emailService.create({
            to: user.email,
            subject: "Senha alterada com sucesso - ObservCore",
            text: "Sua senha foi alterada com sucesso.",
            body: changePasswordTemplate(user.name || 'Usuário'),
        });

        return { message: "Senha alterada com sucesso" };
    }
}