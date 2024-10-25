export interface Message {
  id: string | undefined;
  text: string;
  role: string;
  progress: boolean;
  tool_id: string | undefined;
  tool_name: string | undefined;
}
