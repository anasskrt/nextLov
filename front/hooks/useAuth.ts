import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  sub: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
};

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const isValid = decoded.exp * 1000 > Date.now();

      if (isValid) {
        setUser(decoded);
      } else {
        setUser(null);
        Cookies.remove("token");
      }
    } catch {
      setUser(null);
      Cookies.remove("token");
    }
  }, []);

  // Tu peux déduire isLoggedIn de la présence de user
  return { isLoggedIn: !!user, user };
}
