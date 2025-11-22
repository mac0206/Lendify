import { MemberRepository } from '../repositories/memberRepository';
import { Member } from '@library-system/shared';

export class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
  }

  async createMember(memberData: Omit<Member, '_id'>): Promise<Member> {
    // Check if student ID already exists
    const existingMember = await this.memberRepository.findByStudentId(memberData.studentId);
    if (existingMember) {
      throw new Error('Student ID already exists');
    }
    return await this.memberRepository.create(memberData);
  }

  async getAllMembers(): Promise<Member[]> {
    return await this.memberRepository.findAll();
  }

  async getMemberById(id: string): Promise<Member | null> {
    return await this.memberRepository.findById(id);
  }

  async getMemberByStudentId(studentId: string): Promise<Member | null> {
    return await this.memberRepository.findByStudentId(studentId);
  }

  async updateMember(id: string, memberData: Partial<Member>): Promise<Member | null> {
    return await this.memberRepository.update(id, memberData);
  }

  async deleteMember(id: string): Promise<boolean> {
    return await this.memberRepository.delete(id);
  }

  async addBorrowedItem(memberId: string, bookId: string): Promise<Member | null> {
    return await this.memberRepository.addBorrowedItem(memberId, bookId);
  }

  async removeBorrowedItem(memberId: string, bookId: string): Promise<Member | null> {
    return await this.memberRepository.removeBorrowedItem(memberId, bookId);
  }
}

