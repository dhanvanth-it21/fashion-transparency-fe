export enum TileSize {
    SIZE_1X1 = "1x1",
    SIZE_1_5X1 = "1.5x1",
    SIZE_2X1 = "2x1",
    SIZE_2X2 = "2x2",
    SIZE_3X3 = "3x3",
    SIZE_4X2 = "4x2",
    SIZE_4X4 = "4x4",
    SIZE_6X4 = "6x4",
    SIZE_8X4 = "8x4"
}

export enum TileCategory {
    WALL = "WALL",
    FLOOR = "FLOOR"
}

export enum Finishing {
    GLOSSY = "GLOSSY",
    HIGH_GLOSSY = "HIGH_GLOSSY",
    MATT = "MATT",
    SUGAR = "SUGAR",
    CARVING = "CARVING",
    FULL_BODY = "FULL_BODY"
}

export enum TileSubCategory {
    // For wall
    KITCHEN = "KITCHEN",
    BATHROOM = "BATHROOM",
    ELEVATION = "ELEVATION",

    // For floor
    INDOOR = "INDOOR",
    PARKING = "PARKING",
    ROOFING = "ROOFING"
}

export interface Tile {
    _id: string;
    skuCode: string;
    tileSize: TileSize;
    brandName: string;
    modelName: string;
    qty: number;
    piecesPerBox: number;
    underLowStock: boolean;
}

export interface TileDetial {

    skuCode: string,
    tileSize: TileSize,
    brandName: string,
    modelName: string,
    color: string,
    qty: 50,
    piecesPerBox: 4,
    category: TileCategory,
    subCategory: TileSubCategory,
    finishing: Finishing,
    minimumStockLevel: 10,
    archived: false,
    createdAt: Date,
    updatedAt: Date

}



