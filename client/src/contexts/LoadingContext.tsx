import React, { useState } from 'react';

type LoadingProps = {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
};

const LoadingContext = React.createContext<LoadingProps>(null as any);

export const LoadingProvider: React.FC = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const startLoading = () => {
        setIsLoading(true);
    };

    const stopLoading = () => {
        setIsLoading(false);
    };

    return (
        <LoadingContext.Provider
            value={{
                isLoading,
                startLoading,
                stopLoading,
            }}>
            <>
                {
                    isLoading && <div className='loading-container'>
                        <div className='loading-spinner'>
                            <div className='loader'>
                                <div className='loader'>
                                    <div className='loader'>
                                        <div className='loader'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {children}
            </>
        </LoadingContext.Provider>
    );
};

export default LoadingContext;
