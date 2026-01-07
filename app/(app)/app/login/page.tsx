import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-semibold">Portal login</h1>
          <p className="mt-4 text-lg text-foreground/70">
            Admins and students access their dashboards here. Students use their portal code and phone number.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
