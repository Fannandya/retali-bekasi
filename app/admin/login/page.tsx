import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green">Admin Panel</h1>
          <p className="text-muted text-sm mt-1">Masuk untuk mengelola konten</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
