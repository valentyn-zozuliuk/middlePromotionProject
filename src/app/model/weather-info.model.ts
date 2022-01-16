export interface WeatherResponce {
    main: { temp: number, feels_like: number };
    name: string;
    sys: { country: Country };
    weather: { description: string, icon: string, id: number, main: string}[];
}

export interface Weather {
    temperature: number;
    city: string;
    country: Country;
    date: Date;
    weekDay: number;
    icon: string;
}

export enum City {
    LVIV = 'Lviv',
    KYIV = 'Kyiv',
    ODESA = 'Odesa',
}

export enum Country {
    UA = 'UA'
}
