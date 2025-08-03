import { Conversation } from './services/conversations';

export const conversations: Conversation[] = [
  {
    id: '1',
    name: 'John Doe',
    type: 'direct',
    created_at: '2025-08-02T00:00:00.000Z',
    updated_at: '2025-08-02T00:00:00.000Z',
    last_message: undefined,
    participants: [],
  },
  {
    id: '2',
    name: 'Jane Smith',
    type: 'direct',
    created_at: '2025-08-02T00:00:00.000Z',
    updated_at: '2025-08-02T00:00:00.000Z',
    last_message: undefined,
    participants: [],
  },
];
