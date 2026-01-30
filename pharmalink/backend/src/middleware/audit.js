const db = require('../config/db');

/**
 * POPIA-Compliant Audit Middleware
 * Logs sensitive data access and mutations to the audit_logs table.
 */
const auditLog = (action, resourceType) => {
    return async (req, res, next) => {
        const originalJson = res.json;
        const userId = req.user ? req.user.userId : null;
        const ip = req.ip || req.connection.remoteAddress;

        res.json = function (data) {
            // Only log on successful mutations or sensitive reads
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Background logging to not slow down the response
                db.query(
                    'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
                    [
                        userId,
                        action,
                        resourceType,
                        req.params.id || req.body.id || 'N/A',
                        ip,
                        req.headers['user-agent']
                    ]
                ).catch(err => console.error('[AUDIT] Failed to write log:', err));
            }
            return originalJson.call(this, data);
        };
        next();
    };
};

module.exports = auditLog;
