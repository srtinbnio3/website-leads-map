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
      <DialogContent className="sm:max-w-md">
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
