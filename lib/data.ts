import clientsJson from "@/data/clients.json";
import productsJson from "@/data/products.json";
import transactionsJson from "@/data/transactions.json";
import promosJson from "@/data/promos.json";
import type { Client, Product, Promo, Tx } from "@/lib/types";

export const clients = clientsJson as unknown as Record<string, Client>;
export const products = productsJson as unknown as Record<string, Product>;
export const promos = promosJson as unknown as Record<string, Promo>;

const txFile = transactionsJson as unknown as { nota: string; transactions: Tx[] };
export const transactions: Tx[] = txFile.transactions;

export function findClientByCedula(cedula: string): Client | undefined {
  return Object.values(clients).find((c) => c.cedula === cedula);
}

export function txsOfClient(clientId: string): Tx[] {
  return transactions.filter((t) => t.cliente_id === clientId);
}
