export interface CardObject {
    id: string;
    id_card: string;
    id_set: number;
    name: string;
    description: string; // <- this will be a JSON string that you parse later
    image_small: string;
    image_large: string;
    created_at: string;
    updated_at: string;
    deleted: number;
  }
  