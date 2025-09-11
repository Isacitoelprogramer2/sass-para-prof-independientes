"use client";

import type { FC, HTMLAttributes } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Placement } from "@react-types/overlays";
import { ChevronSelectorVertical, LogOut01, Settings01, User01 } from "@untitledui/icons";
import { useFocusManager } from "react-aria";
import type { DialogProps as AriaDialogProps } from "react-aria-components";
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cx } from "@/utils/cx";
import { useProfileModal } from "@/contexts/profile-modal-context";
import { useConfiguracionModal } from "@/contexts/configuracion-modal-context";

export const NavAccountMenu = ({
    className,
    ...dialogProps
}: AriaDialogProps & { className?: string }) => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { isProfileModalOpen, openProfileModal, closeProfileModal } = useProfileModal();
    const { openConfiguracionModal } = useConfiguracionModal();
    const focusManager = useFocusManager();
    const dialogRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut(firebaseAuth);
            router.push("/auth/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleViewProfile = () => {
        openProfileModal();
    };

    const handleAccountSettings = () => {
        openConfiguracionModal();
    };

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    focusManager?.focusNext({ tabbable: true, wrap: true });
                    break;
                case "ArrowUp":
                    focusManager?.focusPrevious({ tabbable: true, wrap: true });
                    break;
            }
        },
        [focusManager],
    );

    useEffect(() => {
        const element = dialogRef.current;
        if (element) {
            element.addEventListener("keydown", onKeyDown);
        }

        return () => {
            if (element) {
                element.removeEventListener("keydown", onKeyDown);
            }
        };
    }, [onKeyDown]);

    return (
        <>
            <AriaDialog
                {...dialogProps}
                ref={dialogRef}
                className={cx("w-66 rounded-xl bg-secondary_alt shadow-lg ring ring-secondary_alt outline-hidden", className)}
            >
                <div className="rounded-xl bg-primary ring-1 ring-secondary">
                    <div className="flex flex-col gap-0.5 py-1.5">
                        <NavAccountCardMenuItem 
                            label="Ver perfil" 
                            icon={User01} 
                            onClick={handleViewProfile}
                        />
                        <NavAccountCardMenuItem 
                            label="Configuración de cuenta" 
                            icon={Settings01} 
                            onClick={handleAccountSettings}
                        />
                    </div>
                </div>

                <div className="pt-1 pb-1.5">
                    <NavAccountCardMenuItem 
                        label={isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"} 
                        icon={LogOut01} 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    />
                </div>
            </AriaDialog>

            {/* El modal de perfil ahora se renderiza en el layout del dashboard */}
            {/* usando el contexto y portales */}
            
        </>
    );
};

const NavAccountCardMenuItem = ({
    icon: Icon,
    label,
    shortcut,
    disabled = false,
    ...buttonProps
}: {
    icon?: FC<{ className?: string }>;
    label: string;
    shortcut?: string;
    disabled?: boolean;
} & HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button 
            {...buttonProps} 
            disabled={disabled}
            className={cx(
                "group/item w-full cursor-pointer px-1.5 focus:outline-hidden",
                disabled && "opacity-50 cursor-not-allowed",
                buttonProps.className
            )}
        >
            <div
                className={cx(
                    "flex w-full items-center justify-between gap-3 rounded-md p-2",
                    !disabled && "group-hover/item:bg-primary_hover",
                    // Focus styles.
                    "outline-focus-ring group-focus-visible/item:outline-2 group-focus-visible/item:outline-offset-2",
                )}
            >
                <div className={cx(
                    "flex gap-2 text-sm font-semibold text-secondary",
                    !disabled && "group-hover/item:text-secondary_hover"
                )}>
                    {Icon && <Icon className="size-5 text-fg-quaternary" />} {label}
                </div>

                {shortcut && (
                    <kbd className="flex rounded px-1 py-px font-body text-xs font-medium text-tertiary ring-1 ring-secondary ring-inset">{shortcut}</kbd>
                )}
            </div>
        </button>
    );
};

export const NavAccountCard = ({
    popoverPlacement,
}: {
    popoverPlacement?: Placement;
}) => {
    const { user } = useAuth();
    const triggerRef = useRef<HTMLDivElement>(null);
    const isDesktop = useBreakpoint("lg");

    if (!user) {
        return null;
    }

    const getUserInitials = () => {
        if (user.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        }
        if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <div ref={triggerRef} className="relative flex items-center gap-3 rounded-xl p-3 ring-1 ring-secondary ring-inset">
            <AvatarLabelGroup
                size="md"
                src={user.photoURL || ""}
                title={user.displayName || "Usuario"}
                subtitle={user.email || ""}
                status="online"
            />

            <div className="absolute top-1.5 right-1.5">
                <AriaDialogTrigger>
                    <AriaButton className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 pressed:bg-primary_hover pressed:text-fg-quaternary_hover">
                        <ChevronSelectorVertical className="size-4 shrink-0" />
                    </AriaButton>
                    <AriaPopover
                        placement={popoverPlacement ?? (isDesktop ? "right bottom" : "top right")}
                        triggerRef={triggerRef}
                        offset={8}
                        className={({ isEntering, isExiting }) =>
                            cx(
                                "origin-(--trigger-anchor-point) will-change-transform",
                                isEntering &&
                                    "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                                isExiting &&
                                    "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                            )
                        }
                    >
                        <NavAccountMenu />
                    </AriaPopover>
                </AriaDialogTrigger>
            </div>
        </div>
    );
};
