import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './controllers/wallet.controller';
import { CreateWalletUseCase } from './usecases/create-wallet.usecase';
import { GetWalletUseCase } from './usecases/get-wallet.usecase';
import { UpdateWalletUseCase } from './usecases/update-wallet.usecase';
import { DeleteWalletUseCase } from './usecases/delete-wallet.usecase';
import { Wallet } from '../../entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [
    CreateWalletUseCase,
    GetWalletUseCase,
    UpdateWalletUseCase,
    DeleteWalletUseCase,
  ],
})
export class WalletModule {}