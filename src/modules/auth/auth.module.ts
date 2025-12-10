import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constantes";
import { PrismaModule } from "src/common/prisma/prisma.module";

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '10d' },
        })
    ],
    controllers:[AuthController],
    providers: [AuthService]
})
export class AuthModule {}
