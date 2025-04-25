// core/decorators/Tool.ts

import { ToolMetadataRegistry } from "../registry/ToolMetadataRegistry";

import type { z } from "zod";

import 'reflect-metadata';

/**
 * Parameters for the Tool decorator
 * @template TParameters - The Zod schema type for the tool parameters
 */
export type ToolDecoratorParams = {
    /**
     * The name of the tool
     * @default snakeCase(methodName)
     */
    name?: string;
    /** A description of what the tool does */
    description: string;
};

export type StoredToolMetadata = {
    name: string;
    description: string;
    parameters: {
        index: number;
        schema: z.ZodSchema;
    };
    walletClient?: {
        index: number;
    };
    // biome-ignore lint/complexity/noBannedTypes: Function is the correct type for a descriptor value
    target: Function;
};

export type StoredToolMetadataMap = Map<string, StoredToolMetadata>;

export const toolMetadataKey = Symbol("goat:tool");

export function Tool(metadata: { name: string; description: string }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const className = target.constructor.name;
      ToolMetadataRegistry.getInstance().register({
        className,
        methodName: propertyKey,
        name: metadata.name,
        description: metadata.description,
      });
    };
  }