import { catalog } from "@/domain/catalog";
import { ConfiguredProduct } from "./configuredProduct";
import { immutableConfiguredProduct } from "./validation";

export const configuredProductFactory = {
  createEmpty(productId: string): ConfiguredProduct {
    const product = catalog.getProduct(productId);
    if (!product) throw new Error("Product not found.");
    return immutableConfiguredProduct({
      productId,
      configuration: { packageId: product.packageIds[0], toppingIds: [] },
    });
  },

  createFromPreset(productId: string, presetId: string): ConfiguredProduct {
    const product = catalog.getProduct(productId);
    const preset = catalog.getPreset(presetId);
    if (!product || !preset || !product.presetIds.includes(presetId)) {
      throw new Error("This preset is unavailable for this product.");
    }
    return immutableConfiguredProduct({
      productId,
      configuration: {
        packageId: preset.defaultPackageId,
        toppingIds: preset.defaultToppingIds,
      },
    });
  },

  clone(configured: ConfiguredProduct): ConfiguredProduct {
    return immutableConfiguredProduct(configured);
  },
};
