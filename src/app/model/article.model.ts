export interface Article {
    title: string;
    description: string;
    type: ArticleTypes | ArticleTypesFilter;
    createdBy: {
        image: string,
        name: string,
        uid: string
    };
    updatedDate: number;
    uid?: string;
    coverImage: string;
}

export interface ArticleTypeFilter {
    name: string;
    code: ArticleTypesFilter;
    selected: boolean;
}

export interface ArticleOrderFilter {
    name: string;
    code: ArticleOrders;
    selected: boolean;
}

export enum ArticleTypes {
    PRODUCTIVITY = 'PRODUCTIVITY',
    MEDIA = 'MEDIA',
    BUSINESS = 'BUSINESS'
}

export enum ArticleTypesFilter {
    PRODUCTIVITY = 'PRODUCTIVITY',
    MEDIA = 'MEDIA',
    BUSINESS = 'BUSINESS',
    ALL = 'ALL'
}

export enum ArticleOrders {
    DESC = 'DESC',
    ASC = 'ASC'
}
