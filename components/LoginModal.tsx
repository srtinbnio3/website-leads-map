"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthActions } from "@convex-dev/auth/react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { signIn } = useAuthActions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px] shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
        <DialogHeader>
          <DialogTitle>ログインが必要です</DialogTitle>
          <DialogDescription>
            検索機能を利用するには、Googleアカウントでログインしてください。
          </DialogDescription>
        </DialogHeader>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => void signIn("google", { redirectTo: "/" })}
        >
          Googleでサインイン
        </Button>
      </DialogContent>
    </Dialog>
  );
}
