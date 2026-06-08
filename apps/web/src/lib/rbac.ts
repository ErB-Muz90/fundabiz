export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  REGIONAL_ADMIN = 'REGIONAL_ADMIN',
  SME_OWNER = 'SME_OWNER',
  SUPPLIER = 'SUPPLIER',
}

export enum Feature {
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_USERS = 'manage_users',
  APPROVE_KYC = 'approve_kyc',
  MANAGE_LOANS = 'manage_loans',
  MANAGE_ESCROW = 'manage_escrow',
  VIEW_WALLET = 'view_wallet',
  MANAGE_CATALOG = 'manage_catalog',
  VIEW_ORDERS = 'view_orders',
}

const permissionMatrix: Record<Role, Feature[]> = {
  [Role.SUPER_ADMIN]: [
    Feature.VIEW_ANALYTICS,
    Feature.MANAGE_USERS,
    Feature.APPROVE_KYC,
    Feature.MANAGE_LOANS,
    Feature.MANAGE_ESCROW,
    Feature.VIEW_WALLET,
    Feature.MANAGE_CATALOG,
    Feature.VIEW_ORDERS,
  ],
  [Role.REGIONAL_ADMIN]: [
    Feature.VIEW_ANALYTICS,
    Feature.MANAGE_USERS,
    Feature.APPROVE_KYC,
    Feature.MANAGE_LOANS,
    Feature.MANAGE_ESCROW,
    Feature.VIEW_WALLET,
    Feature.VIEW_ORDERS,
  ],
  [Role.SME_OWNER]: [
    Feature.VIEW_WALLET,
    Feature.VIEW_ORDERS,
    Feature.MANAGE_ESCROW,
  ],
  [Role.SUPPLIER]: [
    Feature.VIEW_WALLET,
    Feature.VIEW_ORDERS,
    Feature.MANAGE_ESCROW,
    Feature.MANAGE_CATALOG,
  ],
};

export function canAccess(role: Role | undefined, feature: Feature): boolean {
  if (!role) return false;
  const permissions = permissionMatrix[role];
  if (!permissions) return false;
  return permissions.includes(feature);
}

export function getRoleName(role: Role): string {
  const names: Record<Role, string> = {
    [Role.SUPER_ADMIN]: 'Super Admin',
    [Role.REGIONAL_ADMIN]: 'Regional Admin',
    [Role.SME_OWNER]: 'SME Owner',
    [Role.SUPPLIER]: 'Supplier',
  };
  return names[role];
}

export function getRoleBadgeVariant(role: Role): string {
  const variants: Record<Role, string> = {
    [Role.SUPER_ADMIN]: 'danger',
    [Role.REGIONAL_ADMIN]: 'warning',
    [Role.SME_OWNER]: 'info',
    [Role.SUPPLIER]: 'success',
  };
  return variants[role];
}
