import type { ExtractedElements, InsertElements } from "@shared/schema";

export interface IStorage {
  saveExtractedElements(elements: InsertElements): Promise<ExtractedElements>;
  getExtractedElements(id: number): Promise<ExtractedElements | undefined>;
}

export class MemStorage implements IStorage {
  private elements: Map<number, ExtractedElements>;
  private currentId: number;

  constructor() {
    this.elements = new Map();
    this.currentId = 1;
  }

  async saveExtractedElements(elements: InsertElements): Promise<ExtractedElements> {
    const id = this.currentId++;
    const saved = { ...elements, id };
    this.elements.set(id, saved);
    return saved;
  }

  async getExtractedElements(id: number): Promise<ExtractedElements | undefined> {
    return this.elements.get(id);
  }
}

export const storage = new MemStorage();
