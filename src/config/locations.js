export const COUNTRY_ACCESS_STATES = Object.freeze({
  AVAILABLE: 'available',
  ACTIVE: 'active',
  LIMIT: 'limit',
  MAINTENANCE: 'maintenance',
});

export const LOCATION_IDS = Object.freeze({
  GERMANY: 'germany',
  LITHUANIA: 'lithuania',
  KAZAKHSTAN: 'kazakhstan',
  RUSSIA: 'russia',
  JAPAN: 'japan',
});

export const LOCATIONS = Object.freeze({
  [LOCATION_IDS.GERMANY]: Object.freeze({
    id: LOCATION_IDS.GERMANY,
    code: 'DE',
    cardTitle: 'Германия',
    countryName: 'Германия',
    city: 'Франкфурт',
    region: 'Европа',
    accessState: COUNTRY_ACCESS_STATES.ACTIVE,
    basePing: 10,
    detailPing: 73,
    pricePerMonth: 99,
    accessExpiry: 'до 30 сентября',
    accessExpiryDetail: 'до 19 сентября',
    deviceUsage: '3/5 устройств',
    deviceUsed: 3,
    deviceLimit: 5,
  }),
  [LOCATION_IDS.LITHUANIA]: Object.freeze({
    id: LOCATION_IDS.LITHUANIA,
    code: 'LT',
    cardTitle: 'Литва',
    countryName: 'Литва',
    city: 'Вильнюс',
    region: 'Европа',
    accessState: COUNTRY_ACCESS_STATES.MAINTENANCE,
    basePing: null,
    pricePerMonth: 99,
    accessExpiry: 'до 1 декабря',
    deviceUsage: '5/5 устройств',
    deviceUsed: 5,
    deviceLimit: 5,
    maintenanceText: 'Ведем техработы до четверга, 19:00',
  }),
  [LOCATION_IDS.KAZAKHSTAN]: Object.freeze({
    id: LOCATION_IDS.KAZAKHSTAN,
    code: 'KZ',
    cardTitle: 'Казахстан',
    countryName: 'Казахстан',
    city: 'Астана',
    region: 'Азия',
    accessState: COUNTRY_ACCESS_STATES.LIMIT,
    basePing: 930,
    pricePerMonth: 99,
    accessExpiry: 'до 31.01.2028',
    deviceUsage: '6/6 устройств',
    deviceUsed: 6,
    deviceLimit: 6,
    limitNotice: 'Завтра лимит уменьшится на 1',
  }),
  [LOCATION_IDS.RUSSIA]: Object.freeze({
    id: LOCATION_IDS.RUSSIA,
    code: 'RU',
    cardTitle: 'BittRussia',
    countryName: 'Россия',
    city: 'Москва',
    region: 'Европа',
    accessState: COUNTRY_ACCESS_STATES.AVAILABLE,
    basePing: 923,
    pricePerMonth: 114,
    description: 'Доступ ко всем сервисам из РФ',
    tags: ['Госсервисы', 'Ютуб без рекламы'],
  }),
  [LOCATION_IDS.JAPAN]: Object.freeze({
    id: LOCATION_IDS.JAPAN,
    code: 'JP',
    cardTitle: 'Япония',
    countryName: 'Япония',
    city: 'Токио',
    region: 'Азия',
    accessState: COUNTRY_ACCESS_STATES.AVAILABLE,
    basePing: 33,
    pricePerMonth: 367,
    description: 'Лучший выбор для игр в азии',
    tags: ['Шоппинг', 'Игры'],
  }),
});

export const PURCHASED_LOCATION_IDS = Object.freeze([
  LOCATION_IDS.GERMANY,
  LOCATION_IDS.LITHUANIA,
  LOCATION_IDS.KAZAKHSTAN,
]);

export const AVAILABLE_LOCATION_IDS = Object.freeze([
  LOCATION_IDS.RUSSIA,
  LOCATION_IDS.JAPAN,
]);

export const DEFAULT_LOCATION = LOCATIONS[LOCATION_IDS.RUSSIA];

export function getLocation(locationId) {
  return LOCATIONS[locationId] || DEFAULT_LOCATION;
}
