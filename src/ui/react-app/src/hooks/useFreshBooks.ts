import { useState, useEffect } from 'react';
import { useCallTool } from './useCallTool';

export function useFreshBooks<T>(toolName: string, args?: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { callTool } = useCallTool();

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await callTool(toolName, args);
        
        if (mounted) {
          const content = result?.content?.[0]?.text;
          if (content) {
            setData(JSON.parse(content));
          }
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [toolName, JSON.stringify(args)]);

  return { data, loading, error };
}
