import { useState, useEffect, useCallback } from "react";
import { getUserState } from "../utils/location";
import { useLoading } from "./useLoading";

export const useUserState = () => {
  const [userState, setUserState] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();

  const fetchState = useCallback(async () => {
    const state = await withLoading(getUserState());

    if (state && state !== userState) {
      setUserState(state);
    }
  }, [userState, withLoading]);

  useEffect(() => {
    fetchState();
  }, []);

  return { userState, loading };
};
