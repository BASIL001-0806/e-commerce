import {
  pgTable,
  serial,
  text,
  integer,
  real,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export type Spec = { label: string; value: string };
export type ColorOption = { name: string; hex: string };

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    brand: text("brand").notNull().default("Generic"),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    warranty: text("warranty").notNull().default("1 year brand warranty"),
    priceCents: integer("price_cents").notNull(),
    compareAtCents: integer("compare_at_cents"),
    rating: real("rating").notNull().default(4.2),
    reviews: integer("reviews").notNull().default(0),
    stock: integer("stock").notNull().default(0),
    image: text("image").notNull(),
    accent: text("accent").notNull().default("blue"),
    badge: text("badge"),
    featured: boolean("featured").notNull().default(false),
    colors: jsonb("colors").$type<ColorOption[]>().notNull(),
    specs: jsonb("specs").$type<Spec[]>().notNull(),
    features: jsonb("features").$type<string[]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("products_category_idx").on(table.category)],
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull().default(""),
  postal: text("postal").notNull(),
  paymentMethod: text("payment_method").notNull().default("card"),
  delivery: text("delivery").notNull().default("standard"),
  cardLast4: text("card_last4").notNull(),
  promo: text("promo"),
  status: text("status").notNull().default("confirmed"),
  subtotalCents: integer("subtotal_cents").notNull(),
  discountCents: integer("discount_cents").notNull().default(0),
  shippingCents: integer("shipping_cents").notNull().default(0),
  codFeeCents: integer("cod_fee_cents").notNull().default(0),
  taxCents: integer("tax_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productSlug: text("product_slug").notNull(),
  name: text("name").notNull(),
  brand: text("brand").notNull().default("Generic"),
  image: text("image").notNull(),
  qty: integer("qty").notNull(),
  unitCents: integer("unit_cents").notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
