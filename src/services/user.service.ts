import { pool } from "../config/db";
import { CreateUserInput, UpdateUserInput, User } from "../types/user";

export async function findAll(): Promise<User[]> {
  const { rows } = await pool.query<User>("SELECT * FROM users ORDER BY id");
  return rows;
}

export async function findById(id: number): Promise<User | null> {
  const { rows } = await pool.query<User>("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function create(input: CreateUserInput): Promise<User> {
  const { rows } = await pool.query<User>(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [input.name, input.email],
  );
  return rows[0];
}

export async function update(id: number, input: UpdateUserInput): Promise<User | null> {
  const { rows } = await pool.query<User>(
    `UPDATE users
        SET name = COALESCE($2, name),
            email = COALESCE($3, email),
            updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
    [id, input.name ?? null, input.email ?? null],
  );
  return rows[0] ?? null;
}

export async function remove(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
