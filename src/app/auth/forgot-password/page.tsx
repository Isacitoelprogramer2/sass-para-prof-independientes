"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Form } from "@/components/base/form/form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Mail01, ArrowLeft } from "@untitledui/icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      setIsEmailSent(true);
    } catch (err: any) {
      console.error("Error al enviar email:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No existe una cuenta con este correo electrónico.";
      case "auth/invalid-email":
        return "El correo electrónico no es válido.";
      case "auth/too-many-requests":
        return "Demasiados intentos. Intenta más tarde.";
      default:
        return "Error al enviar el correo. Intenta nuevamente.";
    }
  };

  if (isEmailSent) {
    return (
      <AuthGuard requireAuth={false}>
        <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-primary rounded-xl shadow-lg p-6 text-center space-y-6">
            {/* Icono de éxito */}
            <div className="w-16 h-16 bg-success-subtle rounded-full flex items-center justify-center mx-auto">
              <Mail01 className="w-8 h-8 text-success-primary" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-primary">
                Correo enviado
              </h1>
              <p className="text-tertiary">
                Te hemos enviado un enlace para restablecer tu contraseña a{" "}
                <span className="font-medium text-secondary">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-tertiary">
                Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.
              </p>

              <Button
                onClick={() => setIsEmailSent(false)}
                color="secondary"
                size="lg"
                className="w-full"
              >
                Enviar nuevamente
              </Button>

              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-brand hover:text-brand_hover transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
        </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-tertiary">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla
          </p>
        </div>

        <div className="bg-primary rounded-xl shadow-lg p-6 space-y-6">
          <Form onSubmit={handleResetPassword}>
            <div className="space-y-4">
              {/* Email */}
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={setEmail}
                icon={Mail01}
                size="md"
                isRequired
                isDisabled={isLoading}
              />

              {/* Error message */}
              {error && (
                <div className="text-sm text-error-primary bg-error-subtle p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Botón de submit */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full"
                isDisabled={isLoading || !email}
              >
                {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
              </Button>
            </div>
          </Form>

          {/* Volver al login */}
          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-brand hover:text-brand_hover transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
      </div>
      </AuthGuard>
  );
}
