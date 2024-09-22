export interface Item {
  date_prop_id: string;
  description: string;
  id: string;
  label: string;
  image: string;
  year: number;
}

export type PlayedItem = Item & {
  played: {
    correct: boolean;
  };
};
