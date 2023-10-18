import { createContext, useContext, useEffect, useState } from "react";
import { UserI } from "~/types/UserI";
import { api } from "~/utils/api";

interface UserDetailsContextType {
  data: UserI | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const UserDetailsContext = createContext<UserDetailsContextType>({
  data: undefined,
  isLoading: false,
  error: undefined,
  refetch: () => {},
});

export const useUserDetails = () => {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error("useUserDetails must be used within a UserDetailsProvider");
  }
  return context;
};

export const UserDetailsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userDetails, setUserDetails] = useState<UserI | undefined>(undefined);

  // Get user details from API
  const { data, isLoading, error, refetch } = api.details.profile.useQuery();
  useEffect(() => {
    if (userDetails) {
      setUserDetails(data);
    }
  }, [data]);

  return (
    <UserDetailsContext.Provider
      value={{
        data: userDetails,
        isLoading: isLoading,
        error: error,
        refetch: refetch,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};
