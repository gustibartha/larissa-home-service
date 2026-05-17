"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL: defaults to the current origin so it works on both
// localhost and the LAN IP without reconfiguration.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
