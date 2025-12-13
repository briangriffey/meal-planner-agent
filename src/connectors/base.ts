import { Connector } from '../types';

export abstract class BaseConnector implements Connector {
  abstract name: string;
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
      description: this.getDescription(connector.name),
      input_schema: this.getInputSchema(connector.name)
    }));
  }

  private getDescription(name: string): string {
    const descriptions: Record<string, string> = {
      'send_email': 'Send an email with the meal plan to the recipient',
      'browse_heb': 'Browse HEB website to find ingredients and create a shopping cart link',
      'web_search': 'Search the web for recipes, ingredients, or nutritional information'
    };
    return descriptions[name] || 'Execute a connector action';
  }

  private getInputSchema(name: string): any {
    const schemas: Record<string, any> = {
      'send_email': {
        type: 'object',
        properties: {
          subject: { type: 'string', description: 'Email subject line' },
          body: { type: 'string', description: 'Email body content (HTML supported)' }
        },
        required: ['subject', 'body']
      },
      'browse_heb': {
        type: 'object',
        properties: {
          ingredients: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of ingredients to search for on HEB'
          }
        },
        required: ['ingredients']
      },
      'web_search': {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' }
        },
        required: ['query']
      }
    };
    return schemas[name] || { type: 'object', properties: {} };
  }
}
