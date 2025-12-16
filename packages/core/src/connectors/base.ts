import { Connector, ConnectorInputSchema } from '../types';

export abstract class BaseConnector implements Connector {
  abstract name: string;
  abstract description: string;
  abstract inputSchema: ConnectorInputSchema;
  abstract execute(params: any): Promise<any>;
}

export class ConnectorRegistry {
  private connectors: Map<string, Connector> = new Map();

  register(connector: Connector): void {
    this.connectors.set(connector.name, connector);
  }

  get(name: string): Connector | undefined {
    return this.connectors.get(name);
  }

  getAll(): Connector[] {
    return Array.from(this.connectors.values());
  }

  getToolDefinitions(): any[] {
    return this.getAll().map(connector => ({
      name: connector.name,
      description: connector.description,
      input_schema: connector.inputSchema
    }));
  }
}
