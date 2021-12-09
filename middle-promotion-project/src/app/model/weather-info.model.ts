export interface WeatherResponce {
    main: { temp: number, feels_like: number };
    name: string;
    sys: { country: string };
    weather: { description: string, icon: string, id: number, main: string}[];
}

export interface Weather {
    temperature: number;
    city: string;
    country: string;
    date: Date;
    weekDay: number;
    icon: string;
}
