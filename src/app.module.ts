import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DropsModule } from './drops/drops.module';
import { User } from './users/user.entity';
import { Drop } from './drops/drop.entity';
import { Mintlink } from './drops/mintlink.entity';
import { MintlinkService } from './drops/mintlink.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
      }),
    }),
    AuthModule,
    UsersModule,
    DropsModule,
  ],
  providers: [MintlinkService],
})
export class AppModule {}
