import { ItemRepository } from '../repositories/bookRepository';
import { Item } from '@library-system/shared';

export class ItemService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  async createItem(itemData: Omit<Item, '_id'>): Promise<Item> {
    // Additional validation
    if (!itemData.title || itemData.title.trim() === '') {
      throw new Error('Item title is required');
    }
    if (!itemData.owner || itemData.owner.trim() === '') {
      throw new Error('Item owner is required');
    }
    if (!itemData.type) {
      throw new Error('Item type is required');
    }
    
    return await this.itemRepository.create(itemData);
  }

  async getAllItems(): Promise<Item[]> {
    return await this.itemRepository.findAll();
  }

  async getItemById(id: string): Promise<Item | null> {
    return await this.itemRepository.findById(id);
  }

  async updateItem(id: string, itemData: Partial<Item>): Promise<Item | null> {
    return await this.itemRepository.update(id, itemData);
  }

  async deleteItem(id: string): Promise<boolean> {
    return await this.itemRepository.delete(id);
  }

  async getAvailableItems(): Promise<Item[]> {
    return await this.itemRepository.findByAvailability(true);
  }

  async getItemsByOwner(owner: string): Promise<Item[]> {
    return await this.itemRepository.findByOwner(owner);
  }

  async getItemsByType(type: string): Promise<Item[]> {
    return await this.itemRepository.findByType(type);
  }
}

