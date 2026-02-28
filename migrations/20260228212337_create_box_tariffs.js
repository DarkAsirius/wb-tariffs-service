exports.up = function (knex) {
  return knex.schema.createTable('box_tariffs', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.string('warehouse_name').notNullable();
    table.decimal('box_delivery_and_storage_expr', 10, 2);
    table.decimal('box_delivery_base', 10, 2);
    table.decimal('box_delivery_liter', 10, 2);
    table.decimal('box_storage_base', 10, 4);
    table.decimal('box_storage_liter', 10, 4);
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['date', 'warehouse_name']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('box_tariffs');
};