import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
    countyId?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string;
      image?: string | null;
      role?: string;
      countyId?: string;
      accessToken?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    countyId?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

export {};
