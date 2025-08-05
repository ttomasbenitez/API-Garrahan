exports.up = async function(knex) {
  await knex.schema.createTable('protocolo', function(table) {
    table.increments('protocolo_id').primary();
    table.string('nombre').notNullable();
    table.string('enfermedad').notNullable();
    table.string('linea').notNullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('protocolo');
};