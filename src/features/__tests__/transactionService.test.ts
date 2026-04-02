import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionService } from '../transactions/services/transactionService';
import prisma from '../../config/db';

vi.mock('../../config/db', () => ({
  default: {
    transaction: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('TransactionService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should format data and create a transaction successfully', async () => {
    const mockUserId = 'user-123';
    const mockInput = { amount: 500, type: 'INCOME' as const, category: 'Salary' };
    const mockDbResponse = {
      id: 'txn-1',
      userId: mockUserId,
      ...mockInput,
      notes: null,
      date: new Date(),
    };

    vi.mocked(prisma.transaction.create).mockResolvedValue(mockDbResponse as any);

    const result = await TransactionService.createTransaction(mockUserId, mockInput);

    expect(prisma.transaction.create).toHaveBeenCalledTimes(1);
    expect(result.amount).toBe(500);
    expect(result.notes).toBeNull();
  });
});
