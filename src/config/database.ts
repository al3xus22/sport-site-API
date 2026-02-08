import knex from 'knex';
import config from '../../db/knexfile';
import * as process from "node:process";

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

export const db = knex(dbConfig);

export const checkConnection = async (): Promise<boolean> => {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Подключение к PostgreSQL успешно');
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к PostgreSQL:', error);
    return false;
  }
};

export const closeConnection = async (): Promise<void> => {
  await db.destroy();
  console.log('📴 Подключение к БД закрыто');
}

export default db;
