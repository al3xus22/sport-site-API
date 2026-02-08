import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex('tournaments').del();

  await knex('tournaments').insert([
    {
      title: 'Открытый турнир "Московская Грация"',
      description: 'Ежегодный открытый турнир по художественной гимнастике',
      start_date: '2024-03-01',
      end_date: '2024-03-03',
      location_city: 'Москва',
      location_place: 'Спортивный комплекс «Олимпийский»',
      coverage_type: 'both',
      status: 'planned',
      organizer: 'Федерация художественной гимнастики России'
    },
    {
      title: 'Кубок "Крылья"',
      description: 'Турнир среди детских и юношеских команд',
      start_date: '2024-02-22',
      end_date: '2024-02-25',
      location_city: 'Москва',
      location_place: 'Дворец спорта "Динамо"',
      coverage_type: 'video',
      status: 'planned',
      organizer: 'РОО ЦХГ «Крылья»'
    },
    {
      title: 'Турнир "Морозко"',
      description: 'Зимний открытый турнир',
      start_date: '2024-02-21',
      location_city: 'Москва',
      location_place: 'СК "Юность"',
      coverage_type: 'photo',
      status: 'completed',
      organizer: 'Федерация ХГ Москвы'
    }
  ]);
}
