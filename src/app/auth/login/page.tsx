"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Input } from "@/components/base/input/input";
import { Form } from "@/components/base/form/form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Eye, EyeOff, Mail01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      // Redirigir al dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      // Redirigir al dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Error al iniciar sesión con Google:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No existe una cuenta con este correo electrónico.";
      case "auth/wrong-password":
        return "Contraseña incorrecta.";
      case "auth/invalid-email":
        return "El correo electrónico no es válido.";
      case "auth/user-disabled":
        return "Esta cuenta ha sido deshabilitada.";
      case "auth/too-many-requests":
        return "Demasiados intentos fallidos. Intenta más tarde.";
      default:
        return "Error al iniciar sesión. Intenta nuevamente.";
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Inicia sesión
          </h1>
          <p className="text-tertiary">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <div className="bg-primary rounded-xl shadow-lg p-6 space-y-6">
          {/* Botón de Google */}
          <SocialButton
            social="google"
            theme="gray"
            size="lg"
            className="w-full"
            disabled={isGoogleLoading || isLoading}
            onClick={handleGoogleLogin}
          >
            {isGoogleLoading ? "Conectando..." : "Continuar con Google"}
          </SocialButton>

          {/* Divisor */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-primary text-tertiary">o</span>
            </div>
          </div>

          {/* Formulario de email */}
          <Form onSubmit={handleEmailLogin}>
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
                isDisabled={isLoading || isGoogleLoading}
              />

              {/* Contraseña */}
              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={setPassword}
                  size="md"
                  isRequired
                  isDisabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-quaternary hover:text-secondary transition-colors"
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

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
                isDisabled={isLoading || isGoogleLoading || !email || !password}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </div>
          </Form>

          {/* Enlaces adicionales */}
          <div className="space-y-4 text-center">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-brand hover:text-brand_hover transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>

            <div className="text-sm text-tertiary">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/auth/register"
                className="text-brand hover:text-brand_hover font-medium transition-colors"
              >
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
