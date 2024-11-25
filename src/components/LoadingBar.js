import React from 'react';

const LoadingBar = ({ isLoading }) => {
    return (
        <div>
            {isLoading && (
            <div className="loading-bar-overlay">
            <div className="loading-bar">
                <div className="progress" style={{ width: '0%' }}></div>
            </div>
            </div>
            )}
        </div>
    );
}

export default LoadingBar;