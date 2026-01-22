import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai/react";
import { getDefaultStore } from "jotai/vanilla";
import type { USER } from "@/types";

export interface AUTHRECORD {
  user: USER;
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}
const stored = localStorage.getItem("user");
export const user_atom = atomWithStorage<AUTHRECORD | null>(
  "user",
  stored ? JSON.parse(stored) : null,
);
export const useAuth = () => {
  const [user, setUser] = useAtom(user_atom);
  return [user, setUser] as const;
};

export const get_user_value = () => {
  const store = getDefaultStore();
  return store.get(user_atom);
};

export const clear_user = () => {
  const store = getDefaultStore();
  store.set(user_atom, null);
};

export const set_user_value = (user: AUTHRECORD) => {
  const store = getDefaultStore();
  store.set(user_atom, user);
};
