"use client";

import { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebase";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Input } from "@/components/base/input/input";
import { Form } from "@/components/base/form/form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Eye, EyeOff, Mail01, User01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("El nombre es requerido.");
      return false;
    }
    if (!formData.email.trim()) {
      setError("El correo electrónico es requerido.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const createUserProfile = async (user: any, displayName: string) => {
    try {
      await setDoc(doc(firebaseDb, "users", user.uid), {
        uid: user.uid,
        name: displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
        role: "client",
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        formData.email,
        formData.password
      );

      // Actualizar el nombre del usuario
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      // Crear perfil en Firestore
      await createUserProfile(userCredential.user, formData.name);

      // Redirigir al dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Error al registrarse:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);

      // Crear perfil en Firestore si es un nuevo usuario
      await createUserProfile(result.user, result.user.displayName || "Usuario");

      // Redirigir al dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Error al registrarse con Google:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Ya existe una cuenta con este correo electrónico.";
      case "auth/invalid-email":
        return "El correo electrónico no es válido.";
      case "auth/weak-password":
        return "La contraseña es muy débil. Debe tener al menos 6 caracteres.";
      case "auth/operation-not-allowed":
        return "El registro está deshabilitado temporalmente.";
      default:
        return "Error al crear la cuenta. Intenta nuevamente.";
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.name && formData.email && formData.password && formData.confirmPassword && passwordsMatch;

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Crear cuenta
          </h1>
          <p className="text-tertiary">
            Regístrate para comenzar a usar la plataforma
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
            onClick={handleGoogleRegister}
          >
            {isGoogleLoading ? "Registrando..." : "Registrarse con Google"}
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

          {/* Formulario de registro */}
          <Form onSubmit={handleEmailRegister}>
            <div className="space-y-4">
              {/* Nombre */}
              <Input
                label="Nombre completo"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={handleInputChange("name")}
                icon={User01}
                size="md"
                isRequired
                isDisabled={isLoading || isGoogleLoading}
              />

              {/* Email */}
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="tu@ejemplo.com"
                value={formData.email}
                onChange={handleInputChange("email")}
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
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  size="md"
                  isRequired
                  isDisabled={isLoading || isGoogleLoading}
                  hint="Debe tener al menos 6 caracteres"
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

              {/* Confirmar contraseña */}
              <div className="relative">
                <Input
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  size="md"
                  isRequired
                  isDisabled={isLoading || isGoogleLoading}
                  isInvalid={Boolean(formData.confirmPassword && !passwordsMatch)}
                  hint={formData.confirmPassword && !passwordsMatch ? "Las contraseñas no coinciden" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-quaternary hover:text-secondary transition-colors"
                  disabled={isLoading || isGoogleLoading}
                >
                  {showConfirmPassword ? (
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
                isDisabled={isLoading || isGoogleLoading || !isFormValid}
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </div>
          </Form>

          {/* Enlaces adicionales */}
          <div className="text-center">
            <div className="text-sm text-tertiary">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="text-brand hover:text-brand_hover font-medium transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </div>
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="mt-6 text-center">
          <p className="text-xs text-tertiary">
            Al registrarte, aceptas nuestros{" "}
            <Link href="/terms" className="text-brand hover:text-brand_hover">
              Términos de Servicio
            </Link>{" "}
            y{" "}
            <Link href="/privacy" className="text-brand hover:text-brand_hover">
              Política de Privacidad
            </Link>
          </p>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
