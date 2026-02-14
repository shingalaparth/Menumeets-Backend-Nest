export interface TableEntity {
    id: string;
    tableNumber: string;
    section?: string | null;
    type?: string | null;
    screen?: string | null;
    totalRows?: number | null;
    seatsPerRow?: number | null;
    totalCapacity?: number | null;
    rowConfig?: any;
    row?: string | null;
    seat?: string | null;
    shopId?: string | null;
    foodCourtId?: string | null;
    qrIdentifier: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface TableSessionEntity {
    id: string;
    tableId: string;
    shopId: string;
    additionalTables?: string[] | null;
    status: 'ACTIVE' | 'PAYMENT_PENDING' | 'CLOSED';
    sessionCode: string;
    customerName: string;
    pax: number;
    managedBy: 'VENDOR' | 'CUSTOMER';
    openedAt: Date;
    closedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateTableData {
    tableNumber?: string;
    shopId?: string;
    foodCourtId?: string;
    screen?: string;
    totalRows?: number;
    seatsPerRow?: number;
    totalCapacity?: number;
    rowConfig?: any;
    row?: string;
    seat?: string;
    type?: string;
}
export interface CreateTableSessionData {
    tableId: string;
    shopId: string;
    customerName?: string;
    pax?: number;
    managedBy?: string;
    sessionCode: string;
}
