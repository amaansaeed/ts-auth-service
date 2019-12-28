import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('user_auth', table => {
    table.uuid('user_id').primary();
    table
      .string('email')
      .notNullable()
      .unique();
    table
      .string('username')
      .notNullable()
      .unique();
    table.string('password').notNullable();
    table.dateTime('created_at');
    table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('user_auth');
}
