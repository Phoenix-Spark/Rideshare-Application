import { createContext, useContext } from 'react';
import { useIsMobile } from './MobileDevice';

const DeviceContext = createContext();

export function DeviceProvider({ children }) {
      const isMobile = useIsMobile();

      return (
            <DeviceContext.Provider value={{ isMobile }}>
                  {children}
            </DeviceContext.Provider>
      )
}

export function useDevice(){
      const context = useContext(DeviceContext);
      if(!context){
            throw new Error('useDevice must be used within DeviceProvider');
      }
      return context;
}