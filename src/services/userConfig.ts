import * as fs from 'fs';
import * as path from 'path';

export interface UserPreferences {
  numberOfMeals: number;
  servingsPerMeal: number;
  minProteinPerMeal: number;
  maxCaloriesPerMeal: number;
  dietaryRestrictions: string[];
}

export interface UserSchedule {
  dayOfWeek: number;
  hour: number;
  minute: number;
}

export interface UserEmailConfig {
  recipients: string[];
}

export interface UserConfig {
  userId: string;
  email: UserEmailConfig;
  schedule: UserSchedule;
  preferences: UserPreferences;
  heb: {
    enabled: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersData {
  users: { [userId: string]: UserConfig };
}

/**
 * UserConfigService - Manages user-specific configurations
 *
 * This service provides file-based storage for multiple user configurations.
 * Each user has their own email recipients, schedule, and meal preferences.
 *
 * Storage format: config/users.json
 * {
 *   "users": {
 *     "user1": { email, schedule, preferences, ... },
 *     "user2": { email, schedule, preferences, ... }
 *   }
 * }
 */
export class UserConfigService {
  private configPath: string;
  private systemEmail: { user: string; appPassword: string };
  private claudeModel: string;

  constructor(
    configPath?: string,
    systemEmail?: { user: string; appPassword: string },
    claudeModel?: string
  ) {
    this.configPath = configPath || path.join(process.cwd(), 'config', 'users.json');
    this.systemEmail = systemEmail || { user: '', appPassword: '' };
    this.claudeModel = claudeModel || 'claude-3-sonnet-20240229';
    this.ensureConfigFile();
  }

  /**
   * Ensure the config file and directory exist
   */
  private ensureConfigFile(): void {
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.configPath)) {
      const defaultData: UsersData = { users: {} };
      fs.writeFileSync(this.configPath, JSON.stringify(defaultData, null, 2));
    }
  }

  /**
   * Load all users data from file
   */
  loadUsers(): UsersData {
    try {
      const data = fs.readFileSync(this.configPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading users config:', error);
      return { users: {} };
    }
  }

  /**
   * Save all users data to file
   */
  private saveUsers(data: UsersData): void {
    fs.writeFileSync(this.configPath, JSON.stringify(data, null, 2));
  }

  /**
   * Get configuration for a specific user
   */
  getUserConfig(userId: string): UserConfig | null {
    const data = this.loadUsers();
    return data.users[userId] || null;
  }

  /**
   * Get all user IDs
   */
  getAllUserIds(): string[] {
    const data = this.loadUsers();
    return Object.keys(data.users);
  }

  /**
   * Create or update a user configuration
   */
  saveUserConfig(userConfig: UserConfig): void {
    const data = this.loadUsers();
    const now = new Date().toISOString();

    if (!data.users[userConfig.userId]) {
      userConfig.createdAt = now;
    }
    userConfig.updatedAt = now;

    data.users[userConfig.userId] = userConfig;
    this.saveUsers(data);
  }

  /**
   * Delete a user configuration
   */
  deleteUserConfig(userId: string): boolean {
    const data = this.loadUsers();
    if (data.users[userId]) {
      delete data.users[userId];
      this.saveUsers(data);
      return true;
    }
    return false;
  }

  /**
   * Convert a user config to the legacy Config format
   * This allows compatibility with existing agent code
   */
  toSystemConfig(userConfig: UserConfig): any {
    return {
      email: {
        user: this.systemEmail.user,
        appPassword: this.systemEmail.appPassword,
        recipients: userConfig.email.recipients
      },
      schedule: userConfig.schedule,
      preferences: userConfig.preferences,
      heb: userConfig.heb,
      claude: {
        model: this.claudeModel
      }
    };
  }

  /**
   * Import from legacy config.json format
   * Useful for migrating from single-user to multi-user
   */
  importLegacyConfig(legacyConfig: any, userId: string): void {
    const userConfig: UserConfig = {
      userId,
      email: {
        recipients: legacyConfig.email.recipients
      },
      schedule: legacyConfig.schedule,
      preferences: legacyConfig.preferences,
      heb: legacyConfig.heb
    };

    this.saveUserConfig(userConfig);
  }
}
