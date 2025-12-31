/**
 * Security Middleware for RFQ Router
 * 
 * Integrates institutional-grade security features:
 * - Rate limiting
 * - Input validation
 * - Security monitoring
 */

const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

/**
 * Simple rate limiter (in-memory)
 * For production, use Redis-backed rate limiting
 */
class SimpleRateLimiter {
    constructor() {
        this.requests = new Map();
        this.windowMs = 60000; // 1 minute
        this.maxRequests = 100;
        
        // Cleanup old entries every 5 minutes
        setInterval(() => this.cleanup(), 300000);
    }

    check(identifier) {
        const now = Date.now();
        const userRequests = this.requests.get(identifier) || [];
        
        // Filter requests within window
        const recentRequests = userRequests.filter(time => now - time < this.windowMs);
        
        if (recentRequests.length >= this.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetAt: Math.min(...recentRequests) + this.windowMs
            };
        }
        
        recentRequests.push(now);
        this.requests.set(identifier, recentRequests);
        
        return {
            allowed: true,
            remaining: this.maxRequests - recentRequests.length,
            resetAt: now + this.windowMs
        };
    }

    cleanup() {
        const now = Date.now();
        for (const [identifier, times] of this.requests.entries()) {
            const recent = times.filter(time => now - time < this.windowMs);
            if (recent.length === 0) {
                this.requests.delete(identifier);
            } else {
                this.requests.set(identifier, recent);
            }
        }
    }
}

/**
 * Input validator
 */
class InputValidator {
    validateRFQParams(params) {
        const errors = [];
        
        // Required fields
        if (!params.underlying) errors.push('underlying is required');
        if (!params.strike || params.strike <= 0) errors.push('strike must be positive');
        if (!params.expiry || params.expiry <= Date.now() / 1000) errors.push('expiry must be in the future');
        if (!params.side || !['buy', 'sell'].includes(params.side)) errors.push('side must be buy or sell');
        if (!params.optionType || !['call', 'put'].includes(params.optionType)) errors.push('optionType must be call or put');
        
        // Size validation
        if (params.size !== undefined && (params.size <= 0 || params.size > 1000000)) {
            errors.push('size must be between 0 and 1,000,000');
        }
        
        // Vault address validation (basic format check)
        if (params.vaultAddress && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(params.vaultAddress)) {
            errors.push('vaultAddress must be a valid Solana address');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    validateQuote(quote) {
        const errors = [];
        
        if (!quote.rfqId) errors.push('rfqId is required');
        if (!quote.premium || quote.premium < 0) errors.push('premium must be non-negative');
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    sanitize(input) {
        if (typeof input === 'string') {
            // Remove potential XSS
            return input.replace(/[<>\"']/g, '');
        }
        return input;
    }
}

/**
 * Security monitor
 */
class SecurityMonitor {
    constructor(logger) {
        this.logger = logger;
        this.events = [];
        this.maxEvents = 1000;
    }

    logEvent(type, level, source, details) {
        const event = {
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            level,
            source,
            details,
            timestamp: Date.now()
        };
        
        this.events.push(event);
        if (this.events.length > this.maxEvents) {
            this.events.shift();
        }
        
        this.logger[level === 'high' || level === 'critical' ? 'error' : 'warn']('Security event', event);
    }

    getMetrics() {
        return {
            totalEvents: this.events.length,
            recentEvents: this.events.slice(-20)
        };
    }
}

// Create instances
const rateLimiter = new SimpleRateLimiter();
const validator = new InputValidator();
const monitor = new SecurityMonitor(logger);

/**
 * Rate limiting middleware
 */
function rateLimitMiddleware(req, res, next) {
    const identifier = req.ip || req.socket.remoteAddress || 'unknown';
    const result = rateLimiter.check(identifier);
    
    res.setHeader('X-RateLimit-Limit', rateLimiter.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.resetAt);
    
    if (!result.allowed) {
        monitor.logEvent(
            'rate_limit_exceeded',
            'medium',
            identifier,
            { endpoint: req.path }
        );
        
        return res.status(429).json({
            error: 'Too many requests',
            retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000)
        });
    }
    
    next();
}

/**
 * RFQ validation middleware
 */
function validateRFQ(req, res, next) {
    const validation = validator.validateRFQParams(req.body);
    
    if (!validation.valid) {
        monitor.logEvent(
            'invalid_input',
            'low',
            req.ip || 'unknown',
            { errors: validation.errors, endpoint: req.path }
        );
        
        return res.status(400).json({
            error: 'Validation failed',
            errors: validation.errors
        });
    }
    
    // Sanitize inputs
    for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = validator.sanitize(req.body[key]);
        }
    }
    
    next();
}

/**
 * Quote validation middleware
 */
function validateQuote(req, res, next) {
    const validation = validator.validateQuote(req.body);
    
    if (!validation.valid) {
        monitor.logEvent(
            'invalid_input',
            'low',
            req.ip || 'unknown',
            { errors: validation.errors, endpoint: req.path }
        );
        
        return res.status(400).json({
            error: 'Validation failed',
            errors: validation.errors
        });
    }
    
    next();
}

/**
 * Security metrics endpoint
 */
function getSecurityMetrics(req, res) {
    const metrics = monitor.getMetrics();
    res.json(metrics);
}

module.exports = {
    rateLimitMiddleware,
    validateRFQ,
    validateQuote,
    getSecurityMetrics,
    logger,
    monitor
};
