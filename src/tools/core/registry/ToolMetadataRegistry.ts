// core/registry/ToolMetadataRegistry.ts

type ToolMetadata = {
    className: string;
    methodName: string;
    name: string;
    description: string;
};

export class ToolMetadataRegistry {
    private static instance: ToolMetadataRegistry;
    private tools: ToolMetadata[] = [];

    private constructor() {}

    public static getInstance(): ToolMetadataRegistry {
        if (!ToolMetadataRegistry.instance) {
            ToolMetadataRegistry.instance = new ToolMetadataRegistry();
        }
        return ToolMetadataRegistry.instance;
    }

    public register(metadata: ToolMetadata) {
        this.tools.push(metadata);
    }

    public getTools(): ToolMetadata[] {
        return this.tools;
    }

    public getToolsByClass(className: string): ToolMetadata[] {
        return this.tools.filter(tool => tool.className === className);
    }
}
