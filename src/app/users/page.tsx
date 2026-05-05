"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosClient";
import { User } from "@/lib/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api
      .get<User[]>("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setFetchErr(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (fetchErr) return <div className="err">Something went wrong. Try again.</div>;

  return (
    <div className="wrap">
      <h1 className="page-heading">Users</h1>

      {users.map((u) => (
        <div className="user-row" key={u.id}>
          <div>
            <h2>{u.name}</h2>
            <p>{u.email}</p>
          </div>
          <button className="btn-blue" onClick={() => router.push(`/users/${u.id}`)}>
            View
          </button>
        </div>
      ))}
    </div>
  );
}