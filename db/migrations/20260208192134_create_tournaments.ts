import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tournaments', (table) => {
    table.increments('id').primary();

    table.string('title', 255).notNullable();
    table.text('description');
    table.date('start_date').notNullable();
    table.date('end_date');

    table.string('location_city', 100).notNullable();
    table.string('location_country', 100).defaultTo('Russia');
    table.string('location_place', 255);

    table.enum('coverage_type', ['photo', 'video', 'both', 'none']).defaultTo('none');

    table.enum('status', ['planned', 'ongoing', 'completed', 'cancelled']).defaultTo('planned');

    table.string('organizer', 255);
    table.string('website_url', 500);
    table.string('contact_email', 255);

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['start_date', 'end_date'], 'idx_tournaments_dates');
    table.index(['status'], 'idx_tournaments_status');
    table.index(['location_country', 'location_city'], 'idx_tournaments_location');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tournaments');
}

