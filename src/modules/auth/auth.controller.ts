import { Body, Controller, Post } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { Public } from "src/common/decorators/Public.decorator";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { changePasswordDto } from "./dto/change-password.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    login(@Body() createAuthDto: CreateAuthDto) {
        return this.authService.create(createAuthDto);
    }

    @Public()
    @Post('refresh-token')
    refresh(@Body() body: RefreshTokenDto) {
        return this.authService.refreshToken(body.token);
    }

    @Public()
    @Post('send-code')
    sendCode(@Body() body: { email: string }) {
        return this.authService.sendEmailCode(body.email);
    }

    @Public()
    @Post('validate-code')
    validateCode(@Body() body: { email: string, code: string }) {
        return this.authService.validateCode(body.email, body.code);
    }

    @Public()
    @Post('change-password')
    changePassword(@Body() dto: changePasswordDto & { email: string }) {
        return this.authService.changePassword(dto.email, dto);
    }
}