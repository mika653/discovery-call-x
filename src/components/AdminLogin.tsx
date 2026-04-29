"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { loginAction, type LoginState } from "@/app/admin/actions";

export default function AdminLogin() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, null);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-muted/30 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Admin Access</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter the password to view submissions.
              </p>
            </div>

            <form action={action} className="space-y-4">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                autoFocus
                required
                disabled={pending}
              />
              {state?.error && (
                <p className="text-sm text-destructive text-center">{state.error}</p>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
