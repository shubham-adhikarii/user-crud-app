"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axiosClient";
import { User } from "@/lib/types";

export default function UserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<"ok" | "fail" | null>(null);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get<User>(`/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setNameVal(res.data.name);
        setEmailVal(res.data.email);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function openForm() {
    if (!user) return;
    setNameVal(user.name);
    setEmailVal(user.email);
    setSaveResult(null);
    setShowForm(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const prev = { ...user };

    // optimistic — update UI before the request finishes
    setUser({ ...user, name: nameVal, email: emailVal });
    setShowForm(false);
    setSaving(true);
    setSaveResult(null);

    try {
      await api.put(`/users/${id}`, { name: nameVal, email: emailVal });
      setSaveResult("ok");
    } catch {
      setUser(prev);
      setNameVal(prev.name);
      setEmailVal(prev.email);
      setSaveResult("fail");
      setShowForm(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this user?")) return;
    setDeleting(true);

    // optimistic — redirect right away, fire request in background
    router.push("/users");
    api.delete(`/users/${id}`).catch(() => {
      console.error("Delete request failed");
    });
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (notFound || !user) return <div className="err">User not found.</div>;

  return (
    <div className="wrap">
      <Link href="/users" className="back">← Back</Link>

      {saving && <div className="banner ok">Saving...</div>}
      {saveResult === "ok" && (
        <div className="banner ok">Updated! (JSONPlaceholder won't persist this.)</div>
      )}
      {saveResult === "fail" && (
        <div className="banner fail">Update failed. Changes reverted.</div>
      )}

      <div className="detail-card">
        <h1>{user.name}</h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Website:</strong> {user.website}</p>
        <p><strong>Company:</strong> {user.company.name}</p>
        <p><strong>City:</strong> {user.address.city}</p>

        <div className="btn-row">
          <button className="btn-blue" onClick={openForm} disabled={deleting}>
            Update
          </button>
          <button className="btn-red" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="update-form">
          <h2>Update User</h2>
          <form onSubmit={handleUpdate}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value)}
              required
            />
            <div className="btn-row">
              <button type="submit" className="btn-blue" disabled={saving}>
                Save
              </button>
              <button
                type="button"
                className="btn-gray"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}