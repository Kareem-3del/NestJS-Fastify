import {Module} from '@nestjs/common';
import {AuthModule} from './modules/auth/auth.module';
import {ProductsModule} from './modules/products/products.module';
import {OrdersModule} from './modules/orders/orders.module';
import {InvoicesModule} from './modules/invoices/invoices.module';
import {UsersModule} from './modules/users/users.module';


@Module({
    imports: [
        UsersModule, AuthModule,
        ProductsModule,
        OrdersModule,
        InvoicesModule],
    controllers: [],
    providers: [],
})
export class AppModule {
}
