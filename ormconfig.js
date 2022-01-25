module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  synchronize: false,
  logging: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  subscribers: ['dist/subscribers/**/*.js'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};
