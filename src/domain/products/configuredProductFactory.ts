import { catalog } from "@/domain/catalog";

import { ConfiguredProduct } from "./configuredProduct";

/**
 * Factory responsible for creating
 * configured products.
 */
export const configuredProductFactory = {
  /**
   * Create an empty configuration.
   */
  createEmpty(productId: string): ConfiguredProduct {
    const product = catalog.getProduct(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    return {
      productId,

      configuration: {
        packageId: product.packageIds[0],

        toppingIds: [],
      },
    };
  },

  /**
   * Create a configured product
   * from a preset.
   */
  createFromPreset(productId: string, presetId: string): ConfiguredProduct {
    const preset = catalog.getPreset(presetId);

    if (!preset) {
      throw new Error("Preset not found.");
    }

    return {
      productId,

      configuration: {
        packageId: preset.defaultPackageId,

        toppingIds: [...preset.defaultToppingIds],
      },
    };
  },

  /**
   * Clone an existing configuration.
   */
  clone(configuredProduct: ConfiguredProduct): ConfiguredProduct {
    return {
      productId: configuredProduct.productId,

      configuration: {
        packageId: configuredProduct.configuration.packageId,

        toppingIds: [...configuredProduct.configuration.toppingIds],
      },
    };
  },
};
