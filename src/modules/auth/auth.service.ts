import { Injectable, Logger, NotFoundException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { EmailsService } from "../emails/emails.service";
import { changePasswordDto } from "./dto/change-password.dto";
import { PrismaService } from "src/common/prisma/prisma.service";

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
        const user = await this.prisma.user.findUnique({
            where: { email: createAuthDto.email },
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
        return { message: "Code sent" };
    }

    async validateCode(email: string, code: string) {
        return { message: "Code valid" };
    }

    async changePassword(email: string, dto: changePasswordDto) {
         const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException("User not found");

        const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

        await this.prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        return { message: "Password changed successfully" };
    }
}