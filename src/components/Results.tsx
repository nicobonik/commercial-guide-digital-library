import React, { useState, useRef, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { jumpToPagePlugin } from './jump-to-page-ts/jumpToPagePlugin'; // Ensure this is implemented correctly
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';


interface Result {
    pdfId: string;
    pageNum: number;
}

interface ResultsProps {
    results: Result[];
    onClick: (pdfId: string, pageNum: number) => void;
}

const Results: React.FC<ResultsProps> = ({ results }) => {
    const grouped: Record<string, { pageNumbers: number[]; results: Result[] }> = {};

    results.forEach((result) => {
        const { pdfId, pageNum } = result;
        if (!grouped[pdfId]) {
            grouped[pdfId] = { pageNumbers: [], results: [] };
        }
        grouped[pdfId].results.push(result);
        grouped[pdfId].pageNumbers.push(pageNum);
    });

    const jumpToPagePluginRef = useRef<Record<string, ReturnType<typeof jumpToPagePlugin>>>({});
    const defaultLayoutPluginRef = useRef<Record<string, ReturnType<typeof defaultLayoutPlugin>>>({});
    const [pageUrls, setPageUrls] = useState<Record<string, number>>({}); // Track current page for each PDF
    const [visibleViewers, setVisibleViewers] = useState<Record<string, boolean>>({}); // Track visibility of viewers

    const getJumpToPagePlugin = (pdfId: string) => {
        if (!jumpToPagePluginRef.current[pdfId]) {
            jumpToPagePluginRef.current[pdfId] = jumpToPagePlugin();
        }
        return jumpToPagePluginRef.current[pdfId];
    };

    const getDefaultLayoutPlugin = (pdfId: string)=> {
        
    }

    const handlePageChange = (pdfId: string, page: number) => {
        setPageUrls((prev) => ({
            ...prev,
            [pdfId]: page,
        }));
        const plugin = getJumpToPagePlugin(pdfId);
        plugin.jumpToPage(page - 1); // Convert to 0-based index
    };

    const toggleViewerVisibility = (pdfId: string) => {
        setVisibleViewers((prev) => ({
            ...prev,
            [pdfId]: !prev[pdfId], // Toggle visibility for this PDF
        }));
    };

    useEffect(() => {
        const hideAllViewers = () => {
        setVisibleViewers((prev) => {
            // Create a new object with all values set to false
            const updated = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {} as Record<string, boolean>);
            return updated;
        });
    };
        hideAllViewers();
    },
    [results]);

    return (
        <>
            {Object.entries(grouped).map(([pdfId, data]) => {
                const jumpToPageInstance = getJumpToPagePlugin(pdfId);
                const currentPage = pageUrls[pdfId] || 1; // Default to page 1
                const isViewerVisible = visibleViewers[pdfId] ?? false; // Default to visible

                return (
                    <div className="result-entry" key={pdfId}>
                        <div className="result-header">
                        <h3>
                            <a href={`/pdfs/${pdfId}.pdf`}>{pdfId}</a>: Pages{' '}
                            {data.results.map((result, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(pdfId, result.pageNum)}
                                    style={{
                                        margin: '0 5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {result.pageNum}
                                </button>
                            ))}
                        </h3>
                        <button
                            onClick={() => toggleViewerVisibility(pdfId)}
                            style={{
                                margin: '10px 0',
                                cursor: 'pointer',
                                padding: '5px 10px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                backgroundColor: '#f0f0f0',
                            }}
                        >
                            {isViewerVisible ? 'Hide Viewer' : 'Show Viewer'}
                        </button>
                        </div>
                        {isViewerVisible && (
                            <div
                                style={{
                                    height: '1000px',
                                    border: '1px solid black',
                                    overflow: 'hidden',
                                }}
                            >
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer
                                        fileUrl={`/pdfs/${pdfId}.pdf`}
                                        plugins={[jumpToPageInstance]} // Use persistent plugin instance
                                    />
                                </Worker>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default Results;
