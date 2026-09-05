export type RentalCartItem = {
  costumeId: string;
  slug: string;
  name: string;
  image: string | null;
  quantity: number;
  maxQuantity: number;
};

const CART_KEY = "dex-rental-cart";

export function getRentalCart(): RentalCartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(CART_KEY);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved) as RentalCartItem[];
  } catch {
    return [];
  }
}

export function saveRentalCart(items: RentalCartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(items));

  window.dispatchEvent(
    new CustomEvent("rental-cart-updated")
  );
}

export function addToRentalCart(
  item: RentalCartItem
) {
  const current = getRentalCart();

  const existing = current.find(
    (cartItem) =>
      cartItem.costumeId === item.costumeId
  );

  if (existing) {
    const nextQuantity = Math.min(
      existing.quantity + item.quantity,
      item.maxQuantity
    );

    saveRentalCart(
      current.map((cartItem) =>
        cartItem.costumeId === item.costumeId
          ? {
              ...cartItem,
              quantity: nextQuantity,
              maxQuantity: item.maxQuantity,
            }
          : cartItem
      )
    );

    return;
  }

  saveRentalCart([...current, item]);
}

export function updateRentalCartQuantity(
  costumeId: string,
  quantity: number
) {
  const current = getRentalCart();

  const updated = current.map((item) => {
    if (item.costumeId !== costumeId) {
      return item;
    }

    return {
      ...item,
      quantity: Math.max(
        1,
        Math.min(quantity, item.maxQuantity)
      ),
    };
  });

  saveRentalCart(updated);
}

export function removeFromRentalCart(
  costumeId: string
) {
  const current = getRentalCart();

  saveRentalCart(
    current.filter(
      (item) => item.costumeId !== costumeId
    )
  );
}

export function getRentalCartCount() {
  return getRentalCart().length;
}