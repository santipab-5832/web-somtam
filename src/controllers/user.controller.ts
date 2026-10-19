import { Request, Response } from "express";
import * as userService from "../services/user.service";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid user id" });
    return null;
  }
  return id;
}

function validate(body: any, partial: boolean): string | null {
  const { name, email } = body ?? {};
  if (!partial || name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") return "name is required";
  }
  if (!partial || email !== undefined) {
    if (typeof email !== "string" || !EMAIL_RE.test(email)) return "email is invalid";
  }
  if (partial && name === undefined && email === undefined) return "Nothing to update";
  return null;
}

export async function getUsers(_req: Request, res: Response) {
  res.json(await userService.findAll());
}

export async function getUser(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;
  const user = await userService.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

export async function createUser(req: Request, res: Response) {
  const error = validate(req.body, false);
  if (error) return res.status(400).json({ message: error });
  const user = await userService.create({ name: req.body.name.trim(), email: req.body.email });
  res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;
  const error = validate(req.body, true);
  if (error) return res.status(400).json({ message: error });
  const user = await userService.update(id, { name: req.body.name?.trim(), email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;
  const deleted = await userService.remove(id);
  if (!deleted) return res.status(404).json({ message: "User not found" });
  res.status(204).send();
}
