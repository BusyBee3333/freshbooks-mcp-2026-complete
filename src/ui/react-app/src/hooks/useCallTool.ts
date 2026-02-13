import { useState, useCallback } from 'react';

export function useCallTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callTool = useCallback(async (toolName: string, args: any = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // In MCP apps, we use the message passing API
      const result = await (window as any).mcp?.callTool(toolName, args);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return { callTool, loading, error };
}
