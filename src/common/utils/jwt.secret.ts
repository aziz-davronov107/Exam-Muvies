export class JwtSecret {
  static getAccessSecret(): string {
    return process.env.JWT_ACCESS_SECRET || 'yandiev';
  }

  static getRefreshSecret(): string {
    console.log(process.env.JWT_REFRESH_SECRET);
    return process.env.JWT_REFRESH_SECRET || 'toni';
  }

  static getAccessOptions() {
    return {
      secret: this.getAccessSecret(),
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' },
    };
  }

  static getRefreshOptions() {
    return {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    };
  }
}
