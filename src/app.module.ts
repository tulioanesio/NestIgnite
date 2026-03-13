import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { envSchema } from './config/env.validation';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      validate: (config) => {
        const result = envSchema.safeParse(config);

        if (!result.success) {
          console.error('Error validating environment variables:');
          console.error(result.error.format());
          throw new Error('Invalid environment configuration');
        }

        return result.data;
      },
    }),
    PrismaModule,
    UserModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
