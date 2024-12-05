import { Plugin, PluginFunctions, Viewer } from '@react-pdf-viewer/core';

export interface JumpToPagePlugin extends Plugin {
    jumpToPage: (pageIndex: number) => void;
}

export const jumpToPagePlugin = (): JumpToPagePlugin => {
    let pluginFunctions: PluginFunctions;

    const jumpToPage = (pageIndex: number) => {
        pluginFunctions?.jumpToPage(pageIndex);
    };

    return {
        install: (functions: PluginFunctions) => {
            pluginFunctions = functions;
        },
        jumpToPage,
    };
};

export default jumpToPagePlugin;
