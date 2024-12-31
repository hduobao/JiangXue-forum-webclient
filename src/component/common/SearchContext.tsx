import React, { createContext, useContext, useState, ReactNode } from "react";

// 创建 Context
const SearchContext = createContext<{ searchContext: string; setSearchContext: React.Dispatch<React.SetStateAction<string>> } | undefined>(undefined);

// 创建一个 Provider 来管理作者名字状态
interface SearchContextProviderProps {
  children: ReactNode;
}

export const SearchContextProvider: React.FC<SearchContextProviderProps> = ({ children }) => {
  const [searchContext, setSearchContext] = useState<string>("");
  return (
    <SearchContext.Provider value={{ searchContext, setSearchContext }}>
      {children}
    </SearchContext.Provider>
  );
};

// 自定义 Hook 来使用 Context
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchContextProvider");
  }
  return context;
};
