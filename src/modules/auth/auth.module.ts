import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constantes";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret:  jwtConstants.secret,
            signOptions: { expiresIn: '120d' },
        })
    ],
    controllers:[AuthController],
    providers: [AuthService]
})
export class AuthModule {}