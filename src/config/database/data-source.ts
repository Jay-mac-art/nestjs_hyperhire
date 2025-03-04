import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  host: process.env.DB_HOST,
  type: 'postgres',
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/entity/*.entity.js'],
};

// //For creating table change migrations path to "dist/migrations/*.js" and to seed Data change it to "dist/migrations_seed/*.js and type npm run migration:run in CLI"
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
