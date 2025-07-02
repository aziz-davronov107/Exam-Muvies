export enum MOVIE_QUALITY {
  '240p' = '240p',
  '360p' = '360p',
  '480p' = '480p',
  '720p' = '720p',
  '1080p' = '1080p',
}

export enum ROLES {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum USER_SUBSCRIPTION_STATUS {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
}

export enum PAYMENT_METHOD {
  CARD = 'CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CRYPTO = 'CRYPTO',
}

export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum LANGUAGE {
  UZ = 'UZ',
  RU = 'RU',
  EN = 'EN',
}
export enum SUBSCRIPTION_TYPE {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}
