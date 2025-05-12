export interface CardObject {
    id: string;
    id_card: string;
    id_set: number;
    name: string;
    description: string; // <- este será un JSON string que luego parseas
    image_small: string;
    image_large: string;
    created_at: string;
    updated_at: string;
    deleted: number;
  }
  