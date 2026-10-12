import {
  Batch,
  DeliveryArea,
  InventoryMovement,
  Order,
  Product,
  ProductImage,
  ProductVariant,
  User,
} from "@/types";

// Helper to generate dynamic ISO dates relative to current date (YYYY-MM-DD)
export function getRelativeDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

export const mockUsers: User[] = [
  {
    id: "usr_admin_1",
    name: "Vanvasi Kitchen Lead",
    email: "admin@thevanvasiproject.com.np",
    role: "admin",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "usr_cust_1",
    name: "Aayush Shrestha",
    email: "aayush@example.com",
    role: "customer",
    createdAt: "2026-09-15T12:30:00Z",
  },
];

export const mockProductImages: ProductImage[] = [
  {
    id: "img_hhb_1",
    productId: "prod_hhb",
    url: "/images/hot-honey-butter.svg",
    altText: "The Vanvasi Project - Hot Honey Butter Jar cutout",
    isPrimary: true,
    sortOrder: 1,
  },
  {
    id: "img_gb_1",
    productId: "prod_gb",
    url: "/images/garlic-butter.svg",
    altText: "The Vanvasi Project - Garlic Butter Jar cutout",
    isPrimary: true,
    sortOrder: 1,
  },
];

export const mockVariants: ProductVariant[] = [
  // Hot Honey Butter variants
  {
    id: "var_hhb_100",
    productId: "prod_hhb",
    size: "100 g",
    price: 450,
    sku: "TVP-HHB-100",
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "var_hhb_250",
    productId: "prod_hhb",
    size: "250 g",
    price: 950,
    sku: "TVP-HHB-250",
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
  // Garlic Butter variants
  {
    id: "var_gb_100",
    productId: "prod_gb",
    size: "100 g",
    price: 400,
    sku: "TVP-GB-100",
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "var_gb_250",
    productId: "prod_gb",
    size: "250 g",
    price: 850,
    sku: "TVP-GB-250",
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
];

export const mockBatches: Batch[] = [
  // Hot Honey Butter 100g batches
  {
    id: "bat_hhb_100_near",
    variantId: "var_hhb_100",
    batchCode: "HHB-100-24X",
    madeOn: getRelativeDate(-35),
    bestBefore: getRelativeDate(4), // Expiring in 4 days (NEAR EXPIRY / NON-SELLABLE since < 7 days)
    quantityReceived: 20,
    quantityRemaining: 4,
    createdAt: getRelativeDate(-35) + "T09:00:00Z",
  },
  {
    id: "bat_hhb_100_earliest",
    variantId: "var_hhb_100",
    batchCode: "HHB-100-25A",
    madeOn: getRelativeDate(-14),
    bestBefore: getRelativeDate(21), // Best before in 21 days (SELLABLE, next in FEFO)
    quantityReceived: 35,
    quantityRemaining: 18,
    createdAt: getRelativeDate(-14) + "T10:00:00Z",
  },
  {
    id: "bat_hhb_100_fresh",
    variantId: "var_hhb_100",
    batchCode: "HHB-100-25B",
    madeOn: getRelativeDate(-2),
    bestBefore: getRelativeDate(40), // Fresh batch
    quantityReceived: 40,
    quantityRemaining: 40,
    createdAt: getRelativeDate(-2) + "T11:00:00Z",
  },

  // Hot Honey Butter 250g batches
  {
    id: "bat_hhb_250_earliest",
    variantId: "var_hhb_250",
    batchCode: "HHB-250-25A",
    madeOn: getRelativeDate(-10),
    bestBefore: getRelativeDate(25),
    quantityReceived: 25,
    quantityRemaining: 14,
    createdAt: getRelativeDate(-10) + "T09:30:00Z",
  },
  {
    id: "bat_hhb_250_fresh",
    variantId: "var_hhb_250",
    batchCode: "HHB-250-25B",
    madeOn: getRelativeDate(-1),
    bestBefore: getRelativeDate(42),
    quantityReceived: 30,
    quantityRemaining: 30,
    createdAt: getRelativeDate(-1) + "T14:00:00Z",
  },

  // Garlic Butter 100g batches
  {
    id: "bat_gb_100_expired",
    variantId: "var_gb_100",
    batchCode: "GB-100-24W",
    madeOn: getRelativeDate(-45),
    bestBefore: getRelativeDate(-2), // EXPIRED 2 days ago (needs write-off)
    quantityReceived: 15,
    quantityRemaining: 2,
    createdAt: getRelativeDate(-45) + "T08:00:00Z",
  },
  {
    id: "bat_gb_100_earliest",
    variantId: "var_gb_100",
    batchCode: "GB-100-25A",
    madeOn: getRelativeDate(-12),
    bestBefore: getRelativeDate(18), // Sellable, expiring within 18 days
    quantityReceived: 30,
    quantityRemaining: 12,
    createdAt: getRelativeDate(-12) + "T10:15:00Z",
  },
  {
    id: "bat_gb_100_fresh",
    variantId: "var_gb_100",
    batchCode: "GB-100-25B",
    madeOn: getRelativeDate(-3),
    bestBefore: getRelativeDate(38),
    quantityReceived: 35,
    quantityRemaining: 35,
    createdAt: getRelativeDate(-3) + "T09:45:00Z",
  },

  // Garlic Butter 250g batches
  {
    id: "bat_gb_250_low",
    variantId: "var_gb_250",
    batchCode: "GB-250-25A",
    madeOn: getRelativeDate(-8),
    bestBefore: getRelativeDate(28),
    quantityReceived: 10,
    quantityRemaining: 3, // LOW STOCK (only 3 left)
    createdAt: getRelativeDate(-8) + "T11:20:00Z",
  },
  {
    id: "bat_gb_250_fresh",
    variantId: "var_gb_250",
    batchCode: "GB-250-25B",
    madeOn: getRelativeDate(-1),
    bestBefore: getRelativeDate(41),
    quantityReceived: 20,
    quantityRemaining: 20,
    createdAt: getRelativeDate(-1) + "T16:00:00Z",
  },
];

export const mockProducts: Product[] = [
  {
    id: "prod_hhb",
    name: "Hot Honey Butter",
    slug: "hot-honey-butter",
    characterTitle: "Character No. 01 — The Fiery Nectar",
    tagline: "Wildflower Himalayan honey meets slow-infused sun-dried chillies.",
    description:
      "Crafted with pure cultured cream butter, slow-infused fiery mountain chillies, and raw multi-floral honey sourced from mountain beekeepers in eastern Nepal. Spreads effortlessly over warm crusty sourdough, cornbread, roasted meats, or charred seasonal veggies.",
    ingredients: [
      "Cultured Grass-Fed Butter (Cow's Milk)",
      "Raw Wildflower Mountain Honey",
      "Sun-Dried Himalayan Mountain Chillies",
      "Pink Himalayan Rock Salt",
      "Apple Cider Vinegar Infusion",
    ],
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-28T10:00:00Z",
    images: [mockProductImages[0]],
    variants: [mockVariants[0], mockVariants[1]],
    minPrice: 450,
  },
  {
    id: "prod_gb",
    name: "Garlic Butter",
    slug: "garlic-butter",
    characterTitle: "Character No. 02 — The Roasted Heritage",
    tagline: "Slow-roasted sweet garlic heads, highland thyme & flaky sea salt.",
    description:
      "Whole bulbs of garlic are slow-caramelized to mellow golden perfection and blended with hand-churned dairy butter, fresh mountain thyme, and flaky mineral sea salt. Ideal for melting onto sizzling steaks, tossing into hot pasta, or slathering onto a warm baguette.",
    ingredients: [
      "Cultured Grass-Fed Butter (Cow's Milk)",
      "Slow-Roasted Garlic Cloves",
      "Fresh Highland Thyme Leaves",
      "Flaky Mineral Sea Salt",
      "Black Peppercorn Dust",
    ],
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-28T10:00:00Z",
    images: [mockProductImages[1]],
    variants: [mockVariants[2], mockVariants[3]],
    minPrice: 400,
  },
];

export const mockDeliveryAreas: DeliveryArea[] = [
  {
    id: "area_lazimpat",
    name: "Lazimpat / Baluwatar / Panipokhari",
    deliveryFee: 100,
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "area_thamel",
    name: "Thamel / Maharajgunj / Samakhusi",
    deliveryFee: 100,
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "area_naxal",
    name: "Naxal / Tangal / Durbarmarg",
    deliveryFee: 100,
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "area_baneshwor",
    name: "New Baneshwor / Old Baneshwor / Tinkune",
    deliveryFee: 150,
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "area_jhamsikhel",
    name: "Jhamsikhel / Sanepa / Kupondole (Lalitpur)",
    deliveryFee: 150,
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "area_boudha",
    name: "Boudha / Chabahil / Jorpati",
    deliveryFee: 150,
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "area_outer",
    name: "Outside Ring Road (Kathmandu Valley limits)",
    deliveryFee: 200,
    isActive: true,
    createdAt: "2026-09-01T08:00:00Z",
  },
];

export const mockOrders: Order[] = [
  {
    id: "ord_1001",
    orderNumber: "TVP-1001",
    customerName: "Samyak Bajracharya",
    customerPhone: "9841234567",
    customerEmail: "samyak@example.com",
    fulfilmentType: "delivery",
    deliveryAreaId: "area_lazimpat",
    deliveryAreaName: "Lazimpat / Baluwatar / Panipokhari",
    deliveryAddress: "Near Shankar Hotel, Lazimpat",
    deliveryFee: 100,
    paymentMethod: "cash",
    paymentStatus: "unpaid",
    orderStatus: "confirmed",
    subtotalAmount: 1400,
    totalAmount: 1500,
    notes: "Please call before arriving.",
    items: [
      {
        id: "item_1",
        orderId: "ord_1001",
        variantId: "var_hhb_100",
        productName: "Hot Honey Butter",
        variantSize: "100 g",
        unitPrice: 450,
        quantity: 1,
        totalPrice: 450,
        batches: [
          {
            id: "oib_1",
            orderItemId: "item_1",
            batchId: "bat_hhb_100_earliest",
            batchCode: "HHB-100-25A",
            quantity: 1,
          },
        ],
      },
      {
        id: "item_2",
        orderId: "ord_1001",
        variantId: "var_hhb_250",
        productName: "Hot Honey Butter",
        variantSize: "250 g",
        unitPrice: 950,
        quantity: 1,
        totalPrice: 950,
        batches: [
          {
            id: "oib_2",
            orderItemId: "item_2",
            batchId: "bat_hhb_250_earliest",
            batchCode: "HHB-250-25A",
            quantity: 1,
          },
        ],
      },
    ],
    createdAt: getRelativeDate(-2) + "T10:30:00Z",
    updatedAt: getRelativeDate(-2) + "T10:35:00Z",
  },
  {
    id: "ord_1002",
    orderNumber: "TVP-1002",
    customerName: "Pooja Gurung",
    customerPhone: "9801987654",
    fulfilmentType: "pickup",
    deliveryFee: 0,
    paymentMethod: "cash",
    paymentStatus: "unpaid",
    orderStatus: "ready_for_pickup",
    subtotalAmount: 850,
    totalAmount: 850,
    notes: "Will pick up around 3 PM.",
    items: [
      {
        id: "item_3",
        orderId: "ord_1002",
        variantId: "var_gb_250",
        productName: "Garlic Butter",
        variantSize: "250 g",
        unitPrice: 850,
        quantity: 1,
        totalPrice: 850,
        batches: [
          {
            id: "oib_3",
            orderItemId: "item_3",
            batchId: "bat_gb_250_low",
            batchCode: "GB-250-25A",
            quantity: 1,
          },
        ],
      },
    ],
    createdAt: getRelativeDate(-1) + "T14:10:00Z",
    updatedAt: getRelativeDate(-1) + "T14:45:00Z",
  },
  {
    id: "ord_1003",
    orderNumber: "TVP-1003",
    customerName: "Bikram Thapa",
    customerPhone: "9812345678",
    fulfilmentType: "delivery",
    deliveryAreaId: "area_jhamsikhel",
    deliveryAreaName: "Jhamsikhel / Sanepa / Kupondole (Lalitpur)",
    deliveryAddress: "Near British School, Jhamsikhel",
    deliveryFee: 150,
    paymentMethod: "cash",
    paymentStatus: "paid",
    orderStatus: "completed",
    subtotalAmount: 800,
    totalAmount: 950,
    items: [
      {
        id: "item_4",
        orderId: "ord_1003",
        variantId: "var_gb_100",
        productName: "Garlic Butter",
        variantSize: "100 g",
        unitPrice: 400,
        quantity: 2,
        totalPrice: 800,
        batches: [
          {
            id: "oib_4",
            orderItemId: "item_4",
            batchId: "bat_gb_100_earliest",
            batchCode: "GB-100-25A",
            quantity: 2,
          },
        ],
      },
    ],
    createdAt: getRelativeDate(-5) + "T11:00:00Z",
    updatedAt: getRelativeDate(-5) + "T16:00:00Z",
  },
];

export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: "mov_1",
    variantId: "var_hhb_100",
    batchId: "bat_hhb_100_earliest",
    changeAmount: 35,
    type: "batch_in",
    reason: "New kitchen batch production received",
    createdBy: "admin@thevanvasiproject.com.np",
    timestamp: getRelativeDate(-14) + "T10:00:00Z",
  },
  {
    id: "mov_2",
    variantId: "var_hhb_100",
    batchId: "bat_hhb_100_earliest",
    changeAmount: -1,
    type: "order",
    reason: "Customer Order TVP-1001",
    createdBy: "system",
    timestamp: getRelativeDate(-2) + "T10:30:00Z",
  },
  {
    id: "mov_3",
    variantId: "var_gb_250",
    batchId: "bat_gb_250_low",
    changeAmount: -2,
    type: "offline_sale",
    reason: "Walk-in purchase at Lazimpat kitchen counter",
    createdBy: "admin@thevanvasiproject.com.np",
    timestamp: getRelativeDate(-3) + "T15:20:00Z",
  },
  {
    id: "mov_4",
    variantId: "var_gb_100",
    batchId: "bat_gb_100_expired",
    changeAmount: -1,
    type: "write_off",
    reason: "Damaged seal during shelf inspection",
    createdBy: "admin@thevanvasiproject.com.np",
    timestamp: getRelativeDate(-4) + "T17:00:00Z",
  },
];
