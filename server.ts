import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/admin/create-user", (req, res) => {
    const { userData, adminSecret } = req.body;
    if (adminSecret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: "Unauthorized" });
    
    // In a real app: await admin.auth().createUser({ email, password, displayName })
    console.log(`[Admin SDK] Creating user: ${userData.email}`);
    res.json({ success: true, message: "تم إنشاء المستخدم بنجاح في نظام المصادقة (محاكاة عبر Admin SDK)" });
  });

  app.post("/api/admin/change-password", (req, res) => {
    const { userId, newPassword, adminSecret } = req.body;
    if (adminSecret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: "Unauthorized" });

    // In a real app: await admin.auth().updateUser(userId, { password: newPassword })
    console.log(`[Admin SDK] Changing password for ${userId}`);
    res.json({ success: true, message: "تم تحديث كلمة المرور بنجاح (محاكاة عبر Admin SDK)" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
