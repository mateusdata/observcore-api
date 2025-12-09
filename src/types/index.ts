
export interface JwtPayload {
    sub: string;
    email: string;
    companyId?: string;
    iat?: number;
    exp?: number;


}