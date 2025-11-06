export interface Users {
  id: number;
  name: string;
  email: string;
  hashed_password: string;
  tel: string;
  prefecture_id: number;
  address: string;
  created_at: Date;
}
