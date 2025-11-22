import { LoanRepository } from '../repositories/loanRepository';
import { Loan, calculateDueDate } from '@library-system/shared';
import { ApiClient } from '../utils/apiClient';

const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const catalogApi = new ApiClient(CATALOG_SERVICE_URL, 'Circulation->Catalog');

export class LoanService {
  private loanRepository: LoanRepository;

  constructor() {
    this.loanRepository = new LoanRepository();
  }

  async checkBookAvailability(bookId: string): Promise<boolean> {
    try {
      const response = await catalogApi.get(`/api/books/${bookId}`);
      return response.data.availability === true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Book not found');
      }
      console.error('Error checking book availability:', error.message);
      throw new Error('Failed to check book availability');
    }
  }

  async createLoan(itemId: string, memberId: string, days: number = 14): Promise<Loan> {
    // Check if item is available
    const isAvailable = await this.checkBookAvailability(itemId);
    if (!isAvailable) {
      throw new Error('Item is not available for borrowing');
    }

    // Check if there's already an active loan for this item
    const existingLoan = await this.loanRepository.findActiveLoanByBookId(itemId);
    if (existingLoan) {
      throw new Error('Item is already on loan');
    }

    const borrowDate = new Date();
    const dueDate = calculateDueDate(borrowDate, days);

    const loanData: Omit<Loan, '_id'> = {
      bookId: itemId, // Keep for backward compatibility
      memberId,
      borrowDate,
      dueDate,
      isOverdue: false,
      status: 'active'
    };

    const loan = await this.loanRepository.create(loanData);

    // Update item availability in catalog service - Set to UNAVAILABLE when borrowed
    try {
      const itemResponse = await catalogApi.get(`/api/items/${itemId}`).catch(() => 
        catalogApi.get(`/api/books/${itemId}`)
      );
      const item = itemResponse.data.data || itemResponse.data;
      
      await catalogApi.put(`/api/items/${itemId}`, { availability: false }).catch(() =>
        catalogApi.put(`/api/books/${itemId}`, { availability: false })
      );
      console.log(`✅ Item "${item.title}" marked as UNAVAILABLE (on loan)`);
    } catch (error: any) {
      console.error('Error updating item availability:', error.message);
      // Rollback loan creation if item update fails
      await this.loanRepository.delete(loan._id!.toString());
      throw new Error('Failed to update item availability. Loan cancelled.');
    }

    // Add borrowed item to member in catalog service
    try {
      const memberResponse = await catalogApi.get(`/api/members/${memberId}`);
      const member = memberResponse.data.data || memberResponse.data;
      const borrowedItems = member.borrowedItems || [];
      if (!borrowedItems.includes(itemId)) {
        borrowedItems.push(itemId);
        const updateResponse = await catalogApi.put(`/api/members/${memberId}`, {
          borrowedItems: borrowedItems
        });
        console.log(`✅ Added item to member's borrowed items list`);
      }
    } catch (error: any) {
      console.error('Error updating member borrowed items:', error.message);
      // Note: We don't rollback here as the loan and item update are already done
    }

    return loan;
  }

  async getAllLoans(): Promise<Loan[]> {
    return await this.loanRepository.findAll();
  }

  async getLoanById(id: string): Promise<Loan | null> {
    return await this.loanRepository.findById(id);
  }

  async getLoansByMemberId(memberId: string): Promise<Loan[]> {
    return await this.loanRepository.findByMemberId(memberId);
  }

  async getLoansByBookId(bookId: string): Promise<Loan[]> {
    return await this.loanRepository.findByBookId(bookId);
  }

  async getOverdueLoans(): Promise<Loan[]> {
    await this.loanRepository.updateOverdueStatus();
    return await this.loanRepository.findOverdueLoans();
  }

  async getActiveLoans(): Promise<Loan[]> {
    return await this.loanRepository.findActiveLoans();
  }
}

