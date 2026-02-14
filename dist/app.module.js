"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const core_1 = require("@nestjs/core");
const config_2 = require("./config");
const prisma_module_1 = require("./infrastructure/database/prisma.module");
const redis_module_1 = require("./infrastructure/cache/redis.module");
const external_module_1 = require("./infrastructure/external/external.module");
const user_module_1 = require("./modules/user/user.module");
const vendor_module_1 = require("./modules/vendor/vendor.module");
const auth_module_1 = require("./modules/auth/auth.module");
const shop_module_1 = require("./modules/shop/shop.module");
const menu_module_1 = require("./modules/menu/menu.module");
const table_module_1 = require("./modules/table/table.module");
const cart_module_1 = require("./modules/cart/cart.module");
const order_module_1 = require("./modules/order/order.module");
const payment_module_1 = require("./modules/payment/payment.module");
const staff_module_1 = require("./modules/staff/staff.module");
const kot_module_1 = require("./modules/kot/kot.module");
const invoice_module_1 = require("./modules/invoice/invoice.module");
const captain_module_1 = require("./modules/captain/captain.module");
const franchise_module_1 = require("./modules/franchise/franchise.module");
const food_court_module_1 = require("./modules/food-court/food-court.module");
const notification_module_1 = require("./modules/notification/notification.module");
const review_module_1 = require("./modules/review/review.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const admin_module_1 = require("./modules/admin/admin.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const system_module_1 = require("./modules/system/system.module");
const qr_controller_1 = require("./shared/presentation/qr.controller");
const qr_service_1 = require("./shared/services/qr.service");
const tasks_service_1 = require("./shared/services/tasks.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                load: [
                    config_2.appConfig,
                    config_2.databaseConfig,
                    config_2.redisConfig,
                    config_2.jwtConfig,
                    config_2.cloudinaryConfig,
                    config_2.cashfreeConfig,
                ],
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            external_module_1.ExternalModule,
            user_module_1.UserModule,
            vendor_module_1.VendorModule,
            auth_module_1.AuthModule,
            shop_module_1.ShopModule,
            menu_module_1.MenuModule,
            table_module_1.TableModule,
            cart_module_1.CartModule,
            order_module_1.OrderModule,
            payment_module_1.PaymentModule,
            staff_module_1.StaffModule,
            kot_module_1.KOTModule,
            invoice_module_1.InvoiceModule,
            captain_module_1.CaptainModule,
            franchise_module_1.FranchiseModule,
            food_court_module_1.FoodCourtModule,
            notification_module_1.NotificationModule,
            review_module_1.ReviewModule,
            inventory_module_1.InventoryModule,
            admin_module_1.AdminModule,
            analytics_module_1.AnalyticsModule,
            system_module_1.SystemModule,
        ],
        controllers: [qr_controller_1.QrController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            qr_service_1.QrService,
            tasks_service_1.TasksService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map