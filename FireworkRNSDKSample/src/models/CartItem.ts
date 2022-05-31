import type { ProductPrice } from "react-native-firework-sdk";

export default interface CartItem {
  productId: string;
  unitId: string;
  quantity?: number;
  name?: string;
  price?: ProductPrice;
  description?: string;
  imageURL?: string;
}
