export const up = (pgm) => {
  pgm.addColumn('messages', {
    is_read: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });

  pgm.createIndex('messages', ['conversation_id', 'is_read']);
};

export const down = (pgm) => {
  pgm.dropColumn('messages', 'is_read');
};