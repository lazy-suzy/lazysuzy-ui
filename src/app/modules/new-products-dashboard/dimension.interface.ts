export interface DimensionGroupInterface {
    groupName: string;
    groupValue: DimensionValueInterface[];
}

export interface DimensionValueInterface {
    name: string;
    value: {
        width?: string;
        depth?: string;
        height?: string;
        diameter?: string;
        weight?: string;
        length?: string;
        NULL?: string;
    };
}
