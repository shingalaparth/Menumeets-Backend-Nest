import { FranchiseService } from '../application/franchise.service';
export declare class FranchiseMenuController {
    private franchiseService;
    constructor(franchiseService: FranchiseService);
    getDistributionMatrix(franchiseId: string, vendor: any): Promise<{
        message: string;
        outlets: any[];
        items: never[];
    }>;
    toggleItemForOutlet(franchiseId: string, body: {
        shopId: string;
        globalItemId: string;
        enabled: boolean;
    }, vendor: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
