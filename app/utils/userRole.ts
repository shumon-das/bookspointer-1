import { labels } from "./labels"

export const userRole = (roles: string[]) => {
    if (!Array.isArray(roles) || roles.length <= 0) return labels.userRoleUser

    if (roles.includes('ROLE_AUTHOR')) return labels.userRoleAuthor
    else if (roles.includes('ROLE_PUBLISHER')) return labels.userRolePublisher
    else return labels.userRoleUser
}

export default userRole;