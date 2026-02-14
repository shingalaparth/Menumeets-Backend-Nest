import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CartRepository } from '../domain/cart.repository';
export declare class CartPrismaRepository implements CartRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<({
        items: ({
            shop: {
                id: string;
                phone: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                ownerId: string;
                address: string;
                businessType: string;
                isActive: boolean;
                status: string;
                franchiseId: string | null;
                foodCourtId: string | null;
                region: string | null;
                captainPin: string | null;
                kotPin: string | null;
                upiQrCodeUrl: string | null;
                cashfreeVendorId: string | null;
                cashfreeOnboardingStatus: string;
                settings: import("@prisma/client/runtime/library").JsonValue | null;
                franchisePolicy: import("@prisma/client/runtime/library").JsonValue | null;
                soundPreferences: import("@prisma/client/runtime/library").JsonValue | null;
                franchiseMenuDistribution: import("@prisma/client/runtime/library").JsonValue | null;
            };
            menuItem: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                shopId: string;
                nameHi: string;
                nameGu: string;
                description: string;
                descriptionHi: string;
                descriptionGu: string;
                sortOrder: number;
                isArchived: boolean;
                archivedAt: Date | null;
                price: number | null;
                categoryId: string;
                sourceGlobalItemId: string | null;
                image: import("@prisma/client/runtime/library").JsonValue | null;
                variants: import("@prisma/client/runtime/library").JsonValue | null;
                addOnGroups: import("@prisma/client/runtime/library").JsonValue | null;
                isAvailable: boolean;
                isVegetarian: boolean;
                isVegan: boolean;
                isFavorite: boolean;
                preparationTime: number;
                spiceLevel: string;
                tags: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            name: string;
            shopId: string;
            price: number;
            menuItemId: string;
            quantity: number;
            variant: import("@prisma/client/runtime/library").JsonValue | null;
            addOns: import("@prisma/client/runtime/library").JsonValue | null;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        shopId: string | null;
        foodCourtId: string | null;
        userId: string;
    }) | null>;
    createCart(userId: string, shopId: string | null, foodCourtId: string | null): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        shopId: string | null;
        foodCourtId: string | null;
        userId: string;
    }>;
    addItem(cartId: string, itemData: any): Promise<{
        id: string;
        name: string;
        shopId: string;
        price: number;
        menuItemId: string;
        quantity: number;
        variant: import("@prisma/client/runtime/library").JsonValue | null;
        addOns: import("@prisma/client/runtime/library").JsonValue | null;
        cartId: string;
    }>;
    updateItemQuantity(itemId: string, quantity: number): Promise<{
        id: string;
        name: string;
        shopId: string;
        price: number;
        menuItemId: string;
        quantity: number;
        variant: import("@prisma/client/runtime/library").JsonValue | null;
        addOns: import("@prisma/client/runtime/library").JsonValue | null;
        cartId: string;
    }>;
    removeItem(itemId: string): Promise<void>;
    clearCart(cartId: string): Promise<void>;
}
