export default async function handler(req, res) {
    try {
        // Check if environment variables are set
        const envCheck = {
            GMAIL_USER: !!process.env.GMAIL_USER,
            GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD,
            RECIPIENT_EMAIL: !!process.env.RECIPIENT_EMAIL,
            GMAIL_USER_VALUE: process.env.GMAIL_USER ? process.env.GMAIL_USER.substring(0, 3) + '***' : 'NOT SET',
            APP_PASSWORD_LENGTH: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length : 0
        };
        
        return res.status(200).json({
            message: 'Environment variables check',
            environment: envCheck,
            nodeVersion: process.version
        });
        
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
}