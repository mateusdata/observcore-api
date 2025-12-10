import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { Public } from "src/common/decorators/Public.decorator";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { SendCodeDto } from "./dto/send-code.dto";
import { ValidateCodeDto } from "./dto/validate-code.dto";
import { AuthService } from "./auth.service";

@ApiTags('Auth')
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
    sendCode(@Body() dto: SendCodeDto) {
        return this.authService.sendEmailCode(dto.email);
    }

    @Public()
    @Post('validate-code')
    validateCode(@Body() dto: ValidateCodeDto) {
        return this.authService.validateCode(dto.email, dto.code);
    }

    @Public()
    @Post('change-password')
    changePassword(@Body() dto: ChangePasswordDto) {
        return this.authService.changePassword(dto.email, dto);
    }
}