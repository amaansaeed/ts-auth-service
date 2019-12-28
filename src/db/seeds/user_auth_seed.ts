import * as Knex from 'knex';
// import uuid from 'uuid';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const hash1 = bcrypt.hashSync('password123', salt);
const hash2 = bcrypt.hashSync('password456', salt);
const hash3 = bcrypt.hashSync('password789', salt);

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('user_auth')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('user_auth').insert([
        {
          user_id: 'a61b52a5-6905-4de4-b17e-494436187c6a',
          username: 'hobbes',
          email: 'hobbes@email.com',
          password: hash1,
        },
        {
          user_id: '2cd42796-33ec-48dd-b6ba-a391ee600877',
          username: 'calvin',
          email: 'calvin@email.com',
          password: hash2,
        },
        {
          user_id: '80348fde-44cf-42d5-8b34-5369b5be6736',
          username: 'rumi',
          email: 'rumi@email.com',
          password: hash3,
        },
      ]);
    });
}
