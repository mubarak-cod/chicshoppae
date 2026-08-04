"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./AdminProducts.module.css";

const emptyForm = {
  title: "",
  name: "",
  category: "",
  description: "",
  price: "",
  original_price: "",
  images: "",
  colors: "",
  sizes: "",
  styles: "",
};

function parseTags(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      title: form.title,
      name: form.name,
      category: form.category,
      description: form.description,
      price: Number(form.price || 0),
      original_price: Number(form.original_price || 0),
      images: parseTags(form.images),
      colors: parseTags(form.colors),
      sizes: parseTags(form.sizes),
      styles: parseTags(form.styles),
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) {
        setMessage(error.message || "Unable to update product.");
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("products").insert([{ ...payload, id: crypto.randomUUID() }]);
      if (error) {
        setMessage(error.message || "Unable to add product.");
        setSaving(false);
        return;
      }
    }

    setForm(emptyForm);
    setEditingId(null);
    setMessage(editingId ? "Product updated." : "Product added.");
    await fetchProducts();
    setSaving(false);
  }

  async function handleDelete(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      setMessage(error.message || "Unable to delete product.");
      return;
    }

    setMessage("Product deleted.");
    await fetchProducts();
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      title: product.title || "",
      name: product.name || "",
      category: product.category || "",
      description: product.description || "",
      price: product.price ?? "",
      original_price: product.original_price ?? "",
      images: Array.isArray(product.images) ? product.images.join(", ") : "",
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
      styles: Array.isArray(product.styles) ? product.styles.join(", ") : "",
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div>
            <p className={styles.eyebrow}>Admin dashboard</p>
            <h1 className={styles.pageTitle}>Manage products</h1>
            <p className={styles.pageSubtitle}>Create, edit, and remove products from Supabase.</p>
          </div>
          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {message ? <p className={styles.message}>{message}</p> : null}

        {/* Content grid */}
        <div className={styles.grid}>
          {/* Form panel */}
          <form onSubmit={handleSubmit} className={styles.panel}>
            <h2 className={styles.panelTitle}>{editingId ? "Edit product" : "Add product"}</h2>

            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Title</span>
                <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={styles.inputPill} />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={styles.inputPill} />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Category</span>
                <input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={styles.inputPill} />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Price</span>
                <input type="number" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className={styles.inputPill} />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Original Price</span>
                <input type="number" value={form.original_price} onChange={(event) => setForm({ ...form, original_price: event.target.value })} className={styles.inputPill} />
              </label>

              <label className={`${styles.field} ${styles.spanFull}`}>
                <span className={styles.fieldLabel}>Description</span>
                <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={styles.textarea} />
              </label>

              <label className={`${styles.field} ${styles.spanFull}`}>
                <span className={styles.fieldLabel}>Images (comma separated URLs)</span>
                <input value={form.images} onChange={(event) => setForm({ ...form, images: event.target.value })} className={styles.inputPill} />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Colors (comma separated)</span>
                <input value={form.colors} onChange={(event) => setForm({ ...form, colors: event.target.value })} className={styles.inputPill} />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Sizes (comma separated)</span>
                <input value={form.sizes} onChange={(event) => setForm({ ...form, sizes: event.target.value })} className={styles.inputPill} />
              </label>

              <label className={`${styles.field} ${styles.spanFull}`}>
                <span className={styles.fieldLabel}>Styles (comma separated)</span>
                <input value={form.styles} onChange={(event) => setForm({ ...form, styles: event.target.value })} className={styles.inputPill} />
              </label>
            </div>

            <div className={styles.actions}>
              <button type="submit" disabled={saving} className={styles.primaryBtn}>
                {saving ? "Saving..." : editingId ? "Update product" : "Add product"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className={styles.secondaryBtn}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          {/* Product list panel */}
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Products</h2>

            {loading ? (
              <p className={styles.emptyText}>Loading products...</p>
            ) : products.length === 0 ? (
              <p className={styles.emptyText}>No products yet.</p>
            ) : (
              <div className={styles.productList}>
                {products.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productRow}>
                      <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>{product.title}</h3>
                        <p className={styles.productCategory}>{product.category}</p>
                        <p className={styles.productPrice}>₦{Number(product.price || 0).toLocaleString()}</p>
                      </div>
                      <div className={styles.productActions}>
                        <button type="button" onClick={() => handleEdit(product)} className={styles.editBtn}>
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(product.id)} className={styles.deleteBtn}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}