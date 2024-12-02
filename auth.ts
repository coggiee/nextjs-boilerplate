import NextAuth from "next-auth";

// Add any providers, adapter you want to use
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
  adapter: undefined,
});
