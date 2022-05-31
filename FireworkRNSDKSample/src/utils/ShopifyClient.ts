import ShopifyBuy from 'shopify-buy';
import Base64 from 'react-native-base64';
import { shopifyDomain, shopifyStorefrontAccessToken } from '../config/Shopify.json';

export default class ShopifyClient {
  private static _instance?: ShopifyClient;
  private _client: ShopifyBuy.Client;

  public static getInstance() {
    if (!ShopifyClient._instance) {
      ShopifyClient._instance = new ShopifyClient();
    }

    return ShopifyClient._instance!;
  }

  private constructor() {
    this._client = ShopifyBuy.buildClient({
      domain: shopifyDomain,
      storefrontAccessToken: shopifyStorefrontAccessToken,
    });
  }

  public async fetchProduct(productId: string): Promise<ShopifyBuy.Product> {
    const gid = this.generateProductGid(productId);
    const product = await this._client.product.fetch(gid);
    
    return product;
  }

  public parseId(gid: string): string {
    const decodedGid = Base64.decode(gid);
    const splitArray = decodedGid.split('/');
    if (splitArray.length > 0) {
      return splitArray[splitArray.length - 1];
    }
    return '';
  }

  private generateProductGid(productId: string): string {
    return Base64.encode(`gid://shopify/Product/${productId}`);
  }
}
