export interface CategoryEntity {
    id: string;
    name: string;
    nameHi: string;
    nameGu: string;
    description: string;
    descriptionHi: string;
    descriptionGu: string;
    shopId: string;
    sourceGlobalCategoryId?: string | null;
    isActive: boolean;
    sortOrder: number;
    isArchived: boolean;
    archivedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface MenuItemImage {
    url: string;
    publicId: string;
}
export interface MenuItemVariant {
    name: string;
    nameHi?: string;
    nameGu?: string;
    price: number;
    isAvailable?: boolean;
}
export interface MenuItemAddOn {
    name: string;
    nameHi?: string;
    nameGu?: string;
    price: number;
}
export interface MenuItemAddOnGroup {
    groupName: string;
    selectionType: 'single' | 'multiple';
    addOns: MenuItemAddOn[];
}
export interface MenuItemEntity {
    id: string;
    name: string;
    nameHi: string;
    nameGu: string;
    description: string;
    descriptionHi: string;
    descriptionGu: string;
    price?: number | null;
    shopId: string;
    categoryId: string;
    sourceGlobalItemId?: string | null;
    image?: MenuItemImage | null;
    variants?: MenuItemVariant[] | null;
    addOnGroups?: MenuItemAddOnGroup[] | null;
    isAvailable: boolean;
    isVegetarian: boolean;
    isVegan: boolean;
    isFavorite: boolean;
    preparationTime: number;
    spiceLevel: string;
    tags?: string[] | null;
    sortOrder: number;
    isArchived: boolean;
    archivedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCategoryData {
    name: string;
    nameHi?: string;
    nameGu?: string;
    description?: string;
    descriptionHi?: string;
    descriptionGu?: string;
    shopId: string;
    sortOrder?: number;
}
export interface CreateMenuItemData {
    shopId: string;
    categoryId: string;
    name: string;
    nameHi?: string;
    nameGu?: string;
    description?: string;
    descriptionHi?: string;
    descriptionGu?: string;
    price?: number;
    image?: {
        url: string;
        publicId: string | null;
    };
    variants?: any[];
    addOnGroups?: any[];
    isVegetarian?: boolean;
    isVegan?: boolean;
    spiceLevel?: string;
    tags?: any[];
    preparationTime?: number;
    sourceGlobalItemId?: string;
}
