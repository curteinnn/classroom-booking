import { useRef } from "react";
import { usePageAnimations } from "../../../animations/cardAnimations";
import { getSession } from "../../../shared/auth/sessionStore";

export default function useHomePage() {
  const pageRef = useRef(null);
  usePageAnimations(pageRef);
  return { pageRef, user: getSession()?.user };
}
